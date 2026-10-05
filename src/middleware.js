import { NextResponse } from "next/server";
import { createMiddlewareSupabase } from "@/lib/supabase-middleware";

const ADMIN_HOME = "/super-admin";
const ADMIN_LOGIN = "/super-admin/login";

// Server-side gate for every /super-admin route.
//   • no session                → /super-admin/login
//   • session but not an admin  → /super-admin/login?reason=forbidden
//   • admin on the login page   → /super-admin
// Nothing private is rendered before these checks run because the redirect
// happens here, before the route's React tree is ever executed.
export async function middleware(request) {
  const { supabase, getResponse } = createMiddlewareSupabase(request);
  const { pathname, search } = request.nextUrl;
  const isLoginPage = pathname === ADMIN_LOGIN;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data, error } = await supabase.rpc("is_super_admin");
    isAdmin = !error && data === true;
  }

  const redirectTo = (path, params) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const redirect = NextResponse.redirect(url);
    // Carry over any refreshed auth cookies so the session stays valid.
    getResponse().cookies.getAll().forEach(({ name, value, ...options }) => redirect.cookies.set(name, value, options));
    return harden(redirect);
  };

  if (!user) {
    if (isLoginPage) return harden(getResponse());
    return redirectTo(ADMIN_LOGIN, { next: pathname + search });
  }

  if (!isAdmin) {
    if (isLoginPage) return harden(getResponse());
    return redirectTo(ADMIN_LOGIN, { reason: "forbidden" });
  }

  if (isLoginPage) return redirectTo(ADMIN_HOME);

  return harden(getResponse());
}

function harden(response) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Referrer-Policy", "same-origin");
  response.headers.set("X-Frame-Options", "DENY");
  return response;
}

export const config = {
  matcher: ["/super-admin", "/super-admin/:path*"],
};
