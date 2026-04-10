"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient as createSupabaseClient } from "../../utils/supabase/server";

function getRedirectTarget(raw: FormDataEntryValue | null) {
  const value = typeof raw === "string" && raw.startsWith("/") ? raw : "/dashboard";
  return value;
}

export async function signInWithPassword(formData: FormData) {
  const supabase = await createSupabaseClient();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectedFrom = getRedirectTarget(formData.get("redirectedFrom"));

  if (!email || !password) {
    redirect(`/login?message=${encodeURIComponent("Please enter your email and password.")}&redirectedFrom=${encodeURIComponent(redirectedFrom)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}&redirectedFrom=${encodeURIComponent(redirectedFrom)}`);
  }

  redirect(redirectedFrom);
}

export async function signUpWithPassword(formData: FormData) {
  const supabase = await createSupabaseClient();
  const headersList = await headers();
  const origin = headersList.get("origin") ?? "";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectedFrom = getRedirectTarget(formData.get("redirectedFrom"));

  if (!email || !password) {
    redirect(`/login?message=${encodeURIComponent("Please enter your email and password.")}&redirectedFrom=${encodeURIComponent(redirectedFrom)}`);
  }

  const emailRedirectTo = origin
    ? `${origin}/auth/callback?next=${encodeURIComponent(redirectedFrom)}`
    : undefined;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}&redirectedFrom=${encodeURIComponent(redirectedFrom)}`);
  }

  redirect(`/login?message=${encodeURIComponent("Check your email to confirm your account.")}&redirectedFrom=${encodeURIComponent(redirectedFrom)}`);
}

export async function sendMagicLink(formData: FormData) {
  const supabase = await createSupabaseClient();
  const headersList = await headers();
  const origin = headersList.get("origin") ?? "";

  const email = String(formData.get("email") ?? "").trim();
  const redirectedFrom = getRedirectTarget(formData.get("redirectedFrom"));

  if (!email) {
    redirect(`/login?message=${encodeURIComponent("Please enter your email address.")}&redirectedFrom=${encodeURIComponent(redirectedFrom)}`);
  }

  const emailRedirectTo = origin
    ? `${origin}/auth/callback?next=${encodeURIComponent(redirectedFrom)}`
    : undefined;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}&redirectedFrom=${encodeURIComponent(redirectedFrom)}`);
  }

  redirect(`/login?message=${encodeURIComponent("Magic link sent. Please check your email.")}&redirectedFrom=${encodeURIComponent(redirectedFrom)}`);
}