"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

export default function HomeLoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function routeBySubscription(userId: string) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", userId)
      .single();

    const status = profile?.subscription_status;

    if (status === "trialing" || status === "active") {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    router.push("/pricing");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          router.push("/pricing");
          router.refresh();
          return;
        }

        setMessage("Account created. Please sign in.");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await routeBySubscription(data.user.id);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3efea] px-6 py-16 text-[#2d2018]">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[36px] border border-[#d8c8b7] bg-white px-10 py-12 shadow-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-[#9a7a56]">
            Client Conversation AI
          </p>

          <h1 className="mt-6 font-serif text-5xl uppercase tracking-[0.04em] text-[#2d2018]">
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </h1>

          <p className="mt-6 max-w-xl text-xl leading-10 text-[#5b4638]">
            Sign in to access the app, or create your account to get started.
          </p>

          <form onSubmit={handleSubmit} className="mt-12 max-w-2xl space-y-8">
            <div>
              <label className="mb-4 block text-2xl text-[#2d2018]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[28px] border border-[#dccbb8] bg-white px-6 py-5 text-xl outline-none"
              />
            </div>

            <div>
              <label className="mb-4 block text-2xl text-[#2d2018]">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[28px] border border-[#dccbb8] bg-white px-6 py-5 text-xl outline-none"
              />
            </div>

            {message ? (
              <p className="text-base text-[#7a5d48]">{message}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#2d2018] px-8 py-5 text-2xl uppercase tracking-[0.2em] text-white disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
            }}
            className="mt-8 text-lg text-[#7a5d48] underline underline-offset-4"
          >
            {mode === "login"
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}