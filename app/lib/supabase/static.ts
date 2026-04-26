import "server-only";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-less Supabase client for contexts where `cookies()` is illegal:
 * `generateStaticParams`, `generateMetadata` at build time, sitemap, OG.
 *
 * Uses the same `@supabase/ssr` SDK and the same anon key as the regular
 * server client — so RLS evaluates the request as the anon role and
 * returns rows whose policy permits unauthenticated SELECT (e.g. our
 * "projects: public read published" policy).
 *
 * Module-level singleton — created once per server runtime.
 */
let _client: SupabaseClient | null = null;

export function createStaticClient(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _client = createServerClient(url, key, {
    cookies: {
      getAll: () => [],
      setAll: () => {
        /* no-op — no request context */
      },
    },
  });
  return _client;
}
