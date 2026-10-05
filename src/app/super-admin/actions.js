"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { ADMIN_LOGIN } from "@/lib/admin/auth";

// Ends the Supabase session (cookies cleared server-side) and returns the
// admin to the login screen. Any later request to /super-admin/* is then
// blocked by the middleware because no session exists.
export async function signOut() {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  redirect(`${ADMIN_LOGIN}?signed_out=1`);
}
