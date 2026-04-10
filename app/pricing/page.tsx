"use client";

export default function PricingPage() {
  async function startCheckout() {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
    });

    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#171311] text-white">
      <div className="p-10 border rounded-2xl">
        <h1 className="text-3xl">Start Your 7-Day Trial</h1>
        <p className="mt-2">$29/month (Founding Rate)</p>

        <button
          onClick={startCheckout}
          className="mt-6 bg-[#C6A978] px-6 py-3 rounded-xl text-black"
        >
          Start Trial
        </button>
      </div>
    </main>
  );
}