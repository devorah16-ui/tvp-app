"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function PricingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const priceId = process.env.NEXT_PUBLIC_STRIPE_FOUNDING_PRICE_ID;

      if (!priceId) {
        throw new Error("Missing founding Stripe price ID.");
      }

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed.");
      }

      window.location.href = data.url;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#171311] px-6 py-12 text-[#F3EDE6]">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[32px] border border-[#4A3E36] bg-[#221C19] p-8 shadow-2xl md:p-12">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9D8F83]">
            Simple, Thoughtful Access
          </p>

          <h1 className="mt-4 font-display text-4xl text-[#F3EDE6]">
            One membership. Full access.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#CBBFB3]">
            Start with a 7-day free trial and experience the full system with no
            limitations.
          </p>

          <div className="mt-10 rounded-3xl border border-[#4A3E36] bg-[#171311] p-8">
            <p className="text-sm uppercase tracking-[0.22em] text-[#9D8F83]">
              Founding Member Access
            </p>

            <div className="mt-4 flex items-end gap-2">
              <span className="font-display text-5xl text-[#F3EDE6]">$29</span>
              <span className="pb-1 text-[#CBBFB3]">/ month locked in</span>
            </div>

            <p className="mt-4 text-[#CBBFB3]">
              Standard pricing will be $49/month. Founding rate remains yours as
              long as your subscription stays active.
            </p>

            <ul className="mt-6 space-y-2 text-[#CBBFB3]">
              <li>• 7-day free trial with full access</li>
              <li>• Client message analysis</li>
              <li>• Guided response generation</li>
              <li>• Emotional insight and decision stage clarity</li>
              <li>• Saveable response library</li>
            </ul>

            <button
              onClick={startCheckout}
              disabled={loading}
              className="mt-8 rounded-2xl bg-[#C6A978] px-6 py-3 font-medium text-black transition hover:bg-[#D7BB8C] disabled:opacity-60"
            >
              {loading ? "Redirecting..." : "Start Your 7-Day Trial"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}