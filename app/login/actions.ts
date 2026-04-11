"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient as createSupabaseClient } from "../../utils/supabase/server";

function getRedirectTarget(raw: FormDataEntryValue | null) {
  const value =
    typeof raw === "string" && raw.startsWith("/") ? raw : "/dashboard";
  return value;
}

export async function signInWithPassword(formData: FormData) {
  const supabase = await createSupabaseClient();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getRedirectTarget(formData.get("next"));

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email and password are required.")}`);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(next);
}

export async function signUpWithPassword(formData: FormData) {
  const supabase = await createSupabaseClient();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email and password are required.")}`);
  }

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    redirect(`/login?error=${encodeURIComponent(signUpError.message)}`);
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    redirect(
      `/login?error=${encodeURIComponent(
        signInError.message || "Account created, but sign-in failed."
      )}`
    );
  }

  redirect("/pricing");
}

export async function sendMagicLink(formData: FormData) {
  const supabase = await createSupabaseClient();
  const headerStore = await headers();

  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect(`/login?error=${encodeURIComponent("Email is required.")}`);
  }

  const origin = headerStore.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/login?message=${encodeURIComponent("Check your email for your magic link.")}`);
}