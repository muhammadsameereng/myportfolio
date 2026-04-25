"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client — used in client components for auth + reads.
 * Returns null if env vars aren't configured so the app boots cleanly during
 * setup; callers should check for null and show a "configure Supabase" message.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
