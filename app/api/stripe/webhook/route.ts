import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const missingVars = [
    !stripeSecretKey ? "STRIPE_SECRET_KEY" : null,
    !webhookSecret ? "STRIPE_WEBHOOK_SECRET" : null,
    !supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : null,
    !serviceRoleKey ? "SUPABASE_SERVICE_ROLE_KEY" : null,
  ].filter(Boolean);

  if (missingVars.length > 0) {
    return new NextResponse(
      `WEBHOOK ERROR: missing env vars -> ${missingVars.join(", ")}`,
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("WEBHOOK ERROR: missing stripe-signature", {
      status: 400,
    });
  }

  const rawBody = await req.text();
  const stripe = new Stripe(stripeSecretKey);
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("WEBHOOK ERROR: invalid signature", {
      status: 400,
    });
  }

  if (event.type !== "checkout.session.completed") {
    return new NextResponse(`WEBHOOK OK: ignored ${event.type}`, {
      status: 200,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.supabase_user_id;
  const customerId =
    typeof session.customer === "string" ? session.customer : null;

  if (!userId) {
    return new NextResponse("WEBHOOK ERROR: missing supabase_user_id", {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      stripe_customer_id: customerId,
      subscription_status: "trialing",
    })
    .eq("id", userId)
    .select("id, email, stripe_customer_id, subscription_status");

  if (error) {
    return new NextResponse(`WEBHOOK ERROR: ${error.message}`, {
      status: 500,
    });
  }

  if (!data || data.length === 0) {
    return new NextResponse(`WEBHOOK ERROR: no row updated for ${userId}`, {
      status: 500,
    });
  }

  return new NextResponse(
    `WEBHOOK OK: updated ${data[0].email} to ${data[0].subscription_status}`,
    { status: 200 }
  );
}