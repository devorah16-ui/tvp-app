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

        console.log("WEBHOOK checkout.session.completed", {
          sessionId: session.id,
          userId,
          customerId,
          metadata: session.metadata,
        });

        if (!userId) {
          console.error("Missing supabase_user_id in metadata");
          return new NextResponse("Missing user id", { status: 400 });
        }

        const updatePayload = {
          stripe_customer_id: customerId,
          subscription_status: "trialing",
        };

        console.log("Attempting profile update", {
          userId,
          updatePayload,
        });

        const { data, error } = await supabase
          .from("profiles")
          .update(updatePayload)
          .eq("id", userId)
          .select("id, email, stripe_customer_id, subscription_status");

        console.log("Profile update response", {
          data,
          error,
        });

        if (error) {
          console.error("Update FAILED:", error);
          return new NextResponse("DB error", { status: 500 });
        }

        if (!data || data.length === 0) {
          console.error("No rows updated — ID mismatch", { userId });
          return new NextResponse("No rows updated", { status: 500 });
        }

        console.log("SUCCESS — profile updated");

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook handler crashed:", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}