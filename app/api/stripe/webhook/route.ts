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

  if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    console.error("Missing required environment variables");
    return new NextResponse("Server configuration error", { status: 500 });
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
          console.error("Missing supabase_user_id in checkout session metadata");
          return new NextResponse("Missing supabase_user_id", { status: 400 });
        }

        let status = "trialing";
        let trialEndsAt: string | null = null;
        let currentPeriodEnd: string | null = null;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          status = subscription.status ?? "trialing";
          trialEndsAt = toIsoDate(subscription.trial_end);

          const subscriptionAny = subscription as Stripe.Subscription & {
            current_period_end?: number;
          };

          currentPeriodEnd = toIsoDate(subscriptionAny.current_period_end);

          const { error: subscriptionError } = await supabase
            .from("subscriptions")
            .upsert(
              {
                user_id: userId,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscription.id,
                status,
                trial_ends_at: trialEndsAt,
                current_period_end: currentPeriodEnd,
              },
              {
                onConflict: "stripe_subscription_id",
              }
            );

          if (subscriptionError) {
            console.error("Failed to upsert subscriptions row:", subscriptionError);
            return new NextResponse("Database error", { status: 500 });
          }
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            subscription_status: status,
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

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId =
          typeof subscription.customer === "string" ? subscription.customer : null;

        if (!customerId) {
          console.error("Missing customer id on subscription event");
          return new NextResponse("Missing customer id", { status: 400 });
        }

        const status = subscription.status ?? "active";
        const trialEndsAt = toIsoDate(subscription.trial_end);

        const subscriptionAny = subscription as Stripe.Subscription & {
          current_period_end?: number;
        };

        const currentPeriodEnd = toIsoDate(subscriptionAny.current_period_end);

        const { data: existingProfile, error: profileLookupError } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (profileLookupError) {
          console.error("Failed to look up profile by customer id:", profileLookupError);
          return new NextResponse("Database error", { status: 500 });
        }

        const { error: subscriptionError } = await supabase
          .from("subscriptions")
          .upsert(
            {
              user_id: existingProfile?.id ?? null,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              status,
              trial_ends_at: trialEndsAt,
              current_period_end: currentPeriodEnd,
            },
            {
              onConflict: "stripe_subscription_id",
            }
          );

        if (subscriptionError) {
          console.error("Failed to upsert subscription event row:", subscriptionError);
          return new NextResponse("Database error", { status: 500 });
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            subscription_status: status,
            trial_ends_at: trialEndsAt,
            current_period_end: currentPeriodEnd,
          })
          .eq("stripe_customer_id", customerId);

        if (profileError) {
          console.error("Failed to update profile subscription status:", profileError);
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