import { createServerSupabase } from "@/lib/supabase-server";

export const ADMIN_HOME = "/super-admin";
export const ADMIN_LOGIN = "/super-admin/login";

// Server-side authorization check used by the admin layouts and pages.
// Returns the signed-in user and whether they are an allow-listed super admin.
// The role check runs in Postgres (is_super_admin, SECURITY DEFINER) so a
// client can never fake it.
export async function getAdminSession() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, isAdmin: false };

  const { data, error } = await supabase.rpc("is_super_admin");
  return { supabase, user, isAdmin: !error && data === true };
}

// Only allow in-app redirect targets inside the admin area (no open redirects).
export function safeAdminPath(candidate) {
  if (typeof candidate !== "string") return ADMIN_HOME;
  if (!candidate.startsWith("/super-admin")) return ADMIN_HOME;
  if (candidate.startsWith("//") || candidate.includes("://")) return ADMIN_HOME;
  if (candidate.startsWith(ADMIN_LOGIN)) return ADMIN_HOME;
  return candidate;
}
