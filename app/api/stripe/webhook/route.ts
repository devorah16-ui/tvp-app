import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function toIsoDate(value: number | null | undefined) {
  if (!value) return null;
  return new Date(value * 1000).toISOString();
}

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecretKey) {
    console.error("Missing STRIPE_SECRET_KEY");
    return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 });
  }

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  if (!supabaseUrl) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
    return new NextResponse("Missing NEXT_PUBLIC_SUPABASE_URL", { status: 500 });
  }

  if (!serviceRoleKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  const rawBody = await req.text();

  const stripe = new Stripe(stripeSecretKey);
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.supabase_user_id;
        const customerId =
          typeof session.customer === "string" ? session.customer : null;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;

        if (!userId) {
          console.warn("Missing supabase_user_id in checkout.session.completed metadata");
          break;
        }

        let subscriptionStatus: string | null = null;
        let trialEndsAt: string | null = null;
        let currentPeriodEnd: string | null = null;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          subscriptionStatus = subscription.status;
          trialEndsAt = toIsoDate(subscription.trial_end);
          currentPeriodEnd = toIsoDate(subscription.items.data[0]?.current_period_end);

          const { error: subError } = await supabase.from("subscriptions").upsert(
            {
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              trial_ends_at: trialEndsAt,
              current_period_end: currentPeriodEnd,
            },
            {
              onConflict: "stripe_subscription_id",
            }
          );

          if (subError) {
            console.error("Failed to upsert subscriptions row:", subError);
            return new NextResponse("Database error", { status: 500 });
          }
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            subscription_status: subscriptionStatus,
            trial_ends_at: trialEndsAt,
            current_period_end: currentPeriodEnd,
          })
          .eq("id", userId);

        if (profileError) {
          console.error("Failed to update profile after checkout:", profileError);
          return new NextResponse("Database error", { status: 500 });
        }

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId =
          typeof subscription.customer === "string" ? subscription.customer : null;

        if (!customerId) {
          console.warn("Missing customer id on subscription event");
          break;
        }

        const subscriptionId = subscription.id;
        const status = subscription.status;
        const trialEndsAt = toIsoDate(subscription.trial_end);
        const currentPeriodEnd = toIsoDate(subscription.items.data[0]?.current_period_end);

        const { data: existingSub, error: lookupError } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscriptionId)
          .maybeSingle();

        if (lookupError) {
          console.error("Failed to look up subscription:", lookupError);
          return new NextResponse("Database error", { status: 500 });
        }

        const { error: subUpdateError } = await supabase.from("subscriptions").upsert(
          {
            user_id: existingSub?.user_id ?? null,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status,
            trial_ends_at: trialEndsAt,
            current_period_end: currentPeriodEnd,
          },
          {
            onConflict: "stripe_subscription_id",
          }
        );

        if (subUpdateError) {
          console.error("Failed to upsert subscription update:", subUpdateError);
          return new NextResponse("Database error", { status: 500 });
        }

        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            subscription_status: status,
            trial_ends_at: trialEndsAt,
            current_period_end: currentPeriodEnd,
          })
          .eq("stripe_customer_id", customerId);

        if (profileUpdateError) {
          console.error("Failed to update profile subscription status:", profileUpdateError);
          return new NextResponse("Database error", { status: 500 });
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}