/**
 * Nulls out `thumb_url`s pointing at the previous-portfolio Supabase
 * project, which is now offline (ENOTFOUND). The public data layer
 * substitutes a default Unsplash placeholder when `thumb_url` is null,
 * so the page renders cleanly without those broken hosts.
 *
 * Usage:
 *   npx tsx scripts/clear-dead-thumbnails.ts
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  const text = readFileSync(path, "utf8");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
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

const DEAD_HOST = "aigxthlovwdhytxmdqpn.supabase.co";

async function main() {
  const { data, error } = await sb
    .from("projects")
    .select("id, slug, thumb_url");
  if (error) throw error;

  const targets = (data || []).filter((r) =>
    (r.thumb_url || "").includes(DEAD_HOST)
  );
  console.log(`[clear] ${targets.length} project(s) reference ${DEAD_HOST}`);
  if (targets.length === 0) return;

  for (const r of targets) {
    const { error: upErr } = await sb
      .from("projects")
      .update({ thumb_url: null })
      .eq("id", r.id);
    if (upErr) {
      console.error(`  ✗ ${r.slug}: ${upErr.message}`);
    } else {
      console.log(`  ✓ ${r.slug}`);
    }
  }
  console.log("\n[clear] done");
}

main().catch((e) => {
  console.error("[clear] FAILED:", e);
  process.exit(1);
});
