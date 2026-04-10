"use server";

import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "../../utils/supabase/server";

export async function logout() {
  const supabase = await createSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}