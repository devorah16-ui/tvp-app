"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

type Mode = "login" | "signup";

export default function HomeLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(
            signInError.message ||
              "Account created, but sign-in failed. Please log in manually."
          );
          return;
        }

        router.push("/pricing");
        router.refresh();
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Auth error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!email) {
        setError("Please enter your email for a magic link.");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Magic link sent. Check your email.");
    } catch (err) {
      console.error("Magic link error:", err);
      setError("Unable to send magic link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#171311] text-[#F3EDE6]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12">
        <div className="grid w-full gap-12 lg:grid-cols-[1.2fr_0.9fr]">
          <section className="flex items-center">
            <div className="max-w-2xl">
              <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#C9B8A5]">
                Texas Vogue
              </p>

              <h1 className="text-5xl leading-tight md:text-6xl">
                Welcome back to your client conversation studio.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#D8CEC3]">
                Sign in to access your lead analyzer, coaching tools, scripts,
                and response library. Built to help you guide client
                conversations with more clarity, confidence, and ease.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-[#3B2E26] bg-[#241B17] p-5">
                  <h3 className="text-base font-medium">Lead Analyzer</h3>
                  <p className="mt-2 text-sm text-[#CDBFB2]">
                    Read emotional need and buyer stage faster.
                  </p>
                </div>

                <div className="rounded-3xl border border-[#3B2E26] bg-[#241B17] p-5">
                  <h3 className="text-base font-medium">Coaching</h3>
                  <p className="mt-2 text-sm text-[#CDBFB2]">
                    Practice real conversation scenarios with guidance.
                  </p>
                </div>

                <div className="rounded-3xl border border-[#3B2E26] bg-[#241B17] p-5">
                  <h3 className="text-base font-medium">Scripts</h3>
                  <p className="mt-2 text-sm text-[#CDBFB2]">
                    Use polished replies that feel natural and helpful.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[#3B2E26] bg-[#211917]/95 p-8 shadow-2xl backdrop-blur">
            <div className="mb-6 flex rounded-full border border-[#3B2E26] bg-[#1A1411] p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm transition ${
                  mode === "login"
                    ? "bg-[#3B2E26] text-white"
                    : "text-[#D6C7B8]"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setMessage("");
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm transition ${
                  mode === "signup"
                    ? "bg-[#3B2E26] text-white"
                    : "text-[#D6C7B8]"
                }`}
              >
                Create account
              </button>
            </div>

            <h2 className="text-3xl">
              {mode === "login" ? "Sign in" : "Create your account"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#CDBFB2]">
              {mode === "login"
                ? "Enter your email and password below, or request a magic link."
                : "Create your account with the email you want to use for access."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-[#D6C7B8]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#3B2E26] bg-[#171311] px-4 py-3 text-[#F3EDE6] outline-none placeholder:text-[#84766A]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#D6C7B8]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#3B2E26] bg-[#171311] px-4 py-3 text-[#F3EDE6] outline-none placeholder:text-[#84766A]"
                  placeholder="Enter your password"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              {message ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl border border-[#4A3A31] bg-[#3B2E26] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#4A3A31] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              </button>
            </form>

            {mode === "login" ? (
              <>
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#3B2E26]" />
                  <span className="text-xs uppercase tracking-[0.3em] text-[#8F8174]">
                    Or
                  </span>
                  <div className="h-px flex-1 bg-[#3B2E26]" />
                </div>

                <button
                  type="button"
                  onClick={handleMagicLink}
                  disabled={loading}
                  className="w-full rounded-2xl border border-[#3B2E26] bg-transparent px-4 py-3 text-sm text-[#F3EDE6] transition hover:bg-[#241B17] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Email me a magic link
                </button>
              </>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}