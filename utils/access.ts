import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

type Profile = {
  id: string;
  email: string | null;
  role: string | null;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
};

const ALLOWED_STATUSES = new Set(["trialing", "active"]);

export async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function requirePaidAccess() {
  const { supabase, user } = await requireUser();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, email, role, stripe_customer_id, subscription_status, trial_ends_at, current_period_end"
    )
    .eq("id", user.id)
    .single<Profile>();

  if (error || !profile || !ALLOWED_STATUSES.has(profile.subscription_status ?? "")) {
    redirect("/pricing");
  }

  return { supabase, user, profile };
}