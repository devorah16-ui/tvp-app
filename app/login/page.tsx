"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function LoginPage() {
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
    <main className="min-h-screen bg-[#171311] px-6 py-12 text-[#F3EDE6]">
      <div className="mx-auto max-w-md rounded-3xl border border-[#4A3E36] bg-[#221C19] p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-[#9D8F83]">
          Client Conversation AI
        </p>

        <h1 className="mt-4 font-display text-3xl text-[#F3EDE6]">
          {mode === "login" ? "Welcome Back" : "Create Your Account"}
        </h1>

        <p className="mt-3 text-[#CBBFB3]">
          Sign in to continue, or create your account to begin your trial.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-[#F3EDE6]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-3 text-[#F3EDE6] outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#F3EDE6]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-3 text-[#F3EDE6] outline-none"
            />
          </div>

          {message ? <p className="text-sm text-[#CBBFB3]">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#C6A978] px-5 py-3 font-medium text-black transition hover:bg-[#D7BB8C] disabled:opacity-60"
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
          className="mt-5 text-sm text-[#CBBFB3] underline underline-offset-4"
        >
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}