import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Helpful for first-time syncs
        const userId = session.metadata?.user_id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id || null;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id || null;

        if (userId) {
          await adminSupabase.from("subscriptions").upsert(
            {
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const userId = subscription.metadata?.user_id;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id || null;

        const priceId = subscription.items.data[0]?.price?.id ?? null;

        const periodEndUnix =
          "current_period_end" in subscription &&
          typeof subscription.current_period_end === "number"
            ? subscription.current_period_end
            : null;

        if (userId) {
          await adminSupabase.from("subscriptions").upsert(
            {
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status,
              price_id: priceId,
              current_period_end: periodEndUnix
                ? new Date(periodEndUnix * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}