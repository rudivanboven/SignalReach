"use client";

import { createBrowserClient } from "@supabase/ssr";

// Cookie-based Supabase client for the Super Admin area (browser side).
// Uses ONLY the public URL + publishable key; every query is still subject to
// Row Level Security on the database, so the browser never has more access
// than the signed-in user's role allows.
let client;

export function getBrowserSupabase() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase environment variables");
  client = createBrowserClient(url, key);
  return client;
}
