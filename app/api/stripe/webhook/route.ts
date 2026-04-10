import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecretKey) {
    console.error("Missing STRIPE_SECRET_KEY");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  if (!supabaseUrl) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  if (!serviceRoleKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();
  const stripe = new Stripe(stripeSecretKey);
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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
          console.warn("Missing supabase_user_id in checkout session metadata");
          break;
        }

        const updatePayload = {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: "active",
        };

        const { error } = await supabase
          .from("profiles")
          .update(updatePayload)
          .eq("id", userId);

        if (error) {
          console.error("Failed updating profile on checkout completion:", error);
          return new NextResponse("Database update failed", { status: 500 });
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : null;

        if (!customerId) {
          console.warn("Missing Stripe customer id on subscription.updated");
          break;
        }

        const { error } = await supabase
          .from("profiles")
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Failed updating profile on subscription update:", error);
          return new NextResponse("Database update failed", { status: 500 });
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : null;

        if (!customerId) {
          console.warn("Missing Stripe customer id on subscription.deleted");
          break;
        }

        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "canceled",
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Failed updating profile on subscription deletion:", error);
          return new NextResponse("Database update failed", { status: 500 });
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