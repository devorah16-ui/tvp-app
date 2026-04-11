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

        let trialEndsAt: string | null = null;
        let currentPeriodEnd: string | null = null;

        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            trialEndsAt = toIsoDate(subscription.trial_end);

            const subscriptionAny = subscription as Stripe.Subscription & {
              current_period_end?: number;
            };

            currentPeriodEnd = toIsoDate(subscriptionAny.current_period_end);
          } catch (err) {
            console.error("Failed to retrieve subscription, continuing anyway:", err);
          }
        }

        const forcedStatus = "trialing";

        console.log("Updating profile after checkout:", {
          userId,
          customerId,
          forcedStatus,
          trialEndsAt,
          currentPeriodEnd,
        });

        const { data, error } = await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            subscription_status: forcedStatus,
            trial_ends_at: trialEndsAt,
            current_period_end: currentPeriodEnd,
          })
          .eq("id", userId)
          .select();

        if (error) {
          console.error("Failed to update profile after checkout:", error);
          return new NextResponse("Database error", { status: 500 });
        }

        console.log("Profile updated after checkout:", data);
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

        const subscriptionAny = subscription as Stripe.Subscription & {
          current_period_end?: number;
        };

        const status = subscription.status ?? "active";
        const trialEndsAt = toIsoDate(subscription.trial_end);
        const currentPeriodEnd = toIsoDate(subscriptionAny.current_period_end);

        const { data, error } = await supabase
          .from("profiles")
          .update({
            subscription_status: status,
            trial_ends_at: trialEndsAt,
            current_period_end: currentPeriodEnd,
          })
          .eq("stripe_customer_id", customerId)
          .select();

        if (error) {
          console.error("Failed to update profile subscription status:", error);
          return new NextResponse("Database error", { status: 500 });
        }

        console.log("Profile updated from subscription event:", data);
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