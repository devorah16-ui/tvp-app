import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    console.error("Missing required webhook environment variables");
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

        if (!userId) {
          console.error("Missing supabase_user_id in checkout session metadata");
          return new NextResponse("Missing user id", { status: 400 });
        }

        const { error } = await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            subscription_status: "trialing",
          })
          .eq("id", userId);

        if (error) {
          console.error("Failed to update profile after checkout:", error);
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
          return new NextResponse("Missing customer id", { status: 400 });
        }

        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: subscription.status,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Failed to update subscription status:", error);
          return new NextResponse("Database error", { status: 500 });
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook handler failed:", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}