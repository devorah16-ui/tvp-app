"use server";

import { redirect } from "next/navigation";
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