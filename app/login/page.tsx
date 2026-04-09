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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        setMessage("Account created. You can sign in now.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f3ee] px-6 py-16 text-[#2d241f]">
      <div className="mx-auto max-w-md rounded-[28px] border border-[#e4d6c5] bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.28em] text-[#8a6f53]">
          Client Conversation AI
        </p>

        <h1 className="mt-3 font-serif text-3xl uppercase tracking-[0.04em]">
          {mode === "login" ? "Welcome Back" : "Create Your Account"}
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#5c4a3b]">
          Sign in to access the app, or create your account to get started.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#dccbb8] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#dccbb8] px-4 py-3 outline-none"
            />
          </div>

          {message ? <p className="text-sm text-[#8a6f53]">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#2d241f] px-6 py-3.5 text-sm uppercase tracking-[0.16em] text-white"
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
          className="mt-5 text-sm text-[#7a6048] underline underline-offset-4"
        >
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}