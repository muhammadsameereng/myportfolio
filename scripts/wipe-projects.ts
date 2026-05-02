/**
 * Wipes all rows from `projects` and `categories` tables in Supabase.
 * Run: npx tsx scripts/wipe-projects.ts
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
  console.log("[wipe] target:", URL_);

  console.log("[wipe] deleting projects…");
  const { error: pErr } = await sb
    .from("projects")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (pErr) throw pErr;

  console.log("[wipe] deleting project categories…");
  const { error: cErr } = await sb
    .from("categories")
    .delete()
    .eq("kind", "project");
  if (cErr) throw cErr;

  const head = { count: "exact" as const, head: true };
  const [{ count: pc }, { count: cc }] = await Promise.all([
    sb.from("projects").select("id", head),
    sb.from("categories").select("id", head).eq("kind", "project"),
  ]);
  console.log(`[wipe] ✓ projects=${pc}  project-categories=${cc}`);
}

main().catch((e) => {
  console.error("[wipe] FAILED:", e);
  process.exit(1);
});
