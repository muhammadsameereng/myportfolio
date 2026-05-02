/**
 * Adds `gallery_urls text[] not null default '{}'` to the projects table.
 * Idempotent — uses ADD COLUMN IF NOT EXISTS. Run once, safe to re-run.
 *
 * Usage: npx tsx scripts/migrate-add-gallery.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const candidates = [".env.local", ".env"];
  let text = "";
  for (const c of candidates) {
    try {
      text = readFileSync(resolve(process.cwd(), c), "utf8");
      break;
    } catch {}
  }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createClient(URL_, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log("[migrate] target:", URL_);
  // Supabase JS doesn't run raw DDL via REST. Use the SQL endpoint via a
  // stored function if available — otherwise instruct the user to run the
  // SQL in the Supabase SQL editor. Try `pg_meta` style if exposed.
  const sql =
    "alter table public.projects add column if not exists gallery_urls text[] not null default '{}';";
  const { error } = await sb.rpc("exec_sql" as never, { sql } as never);
  if (error) {
    console.error("[migrate] RPC exec_sql is not available on this project.");
    console.error("[migrate] Run this SQL manually in Supabase → SQL Editor:");
    console.error("\n" + sql + "\n");
    process.exit(2);
  }
  console.log("[migrate] ✓ column added (or already existed)");
}

main().catch((e) => {
  console.error("[migrate] FAILED:", e);
  process.exit(1);
});
