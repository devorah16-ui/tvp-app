import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createSupabaseClient } from "../../../utils/supabase/server";

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePriceId = process.env.STRIPE_PRICE_ID;

if (!stripeSecretKey || !stripePriceId) {
  console.error("Stripe env debug", {
    hasSecret: !!stripeSecretKey,
    hasPriceId: !!stripePriceId,
    priceIdLength: stripePriceId?.length ?? 0,
  });

  return NextResponse.json(
    {
      error: "Server configuration error",
      hasSecret: !!stripeSecretKey,
      hasPriceId: !!stripePriceId,
      priceIdLength: stripePriceId?.length ?? 0,
    },
    { status: 500 }
  );
}

    const stripe = new Stripe(stripeSecretKey);
    const supabase = await createSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const origin = new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: user.email ?? undefined,
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      metadata: {
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}