import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

const ALLOWED = new Set(["trialing", "active"]);

export async function requirePaidAccess() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  if (!profile || !ALLOWED.has(profile.subscription_status)) {
    redirect("/pricing");
  }

  return { user, profile };
}