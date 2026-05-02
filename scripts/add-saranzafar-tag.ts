import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const candidates = [".env.local", ".env"];
let text = "";
for (const c of candidates) {
  try { text = readFileSync(resolve(process.cwd(), c), "utf8"); break; } catch {}
}
for (const raw of text.split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq < 0) continue;
  const k = line.slice(0, eq).trim();
  let v = line.slice(eq + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  if (!process.env[k]) process.env[k] = v;
}

async function main() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await sb.from("blog_posts").select("id,slug,tags");
  if (error) throw error;
  let updated = 0;
  for (const row of data ?? []) {
    const tags: string[] = row.tags ?? [];
    if (tags.includes("saranzafar")) continue;
    const next = [...tags, "saranzafar"];
    const { error: upErr } = await sb.from("blog_posts").update({ tags: next }).eq("id", row.id);
    if (upErr) throw upErr;
    updated++;
  }
  console.log(`tagged ${updated} / ${data?.length ?? 0} posts with "saranzafar"`);
}
main().catch((e) => { console.error(e); process.exit(1); });
