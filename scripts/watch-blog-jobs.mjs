// Dev helper: prints recent blog_jobs rows (service-role, bypasses RLS) so
// we can watch the pipeline advance during local verification.
//   node scripts/watch-blog-jobs.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    try {
      for (const line of readFileSync(f, "utf8").split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) {
          process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
        }
      }
    } catch {}
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data, error } = await supabase
  .from("blog_jobs")
  .select(
    "id,topic,depth,status,stage,attempts,post_id,error,research_notes,outline,draft_md,metadata_json,thumb_url,updated_at"
  )
  .order("created_at", { ascending: false })
  .limit(5);

if (error) {
  console.error("QUERY ERROR:", error.message);
  if (/does not exist|schema cache/i.test(error.message)) {
    console.error("\n→ The blog_jobs table is not created yet. Apply supabase/schema.sql.");
  }
  process.exit(2);
}

if (!data || data.length === 0) {
  console.log("blog_jobs table exists ✓ — but no jobs yet.");
  process.exit(0);
}

const has = (v) => (v == null || v === "" ? "·" : "✓");
for (const j of data) {
  console.log(
    `\n[${j.status.toUpperCase()}] stage=${j.stage} depth=${j.depth} attempts=${j.attempts}`
  );
  console.log(`  topic: ${j.topic}`);
  console.log(
    `  outputs: research=${has(j.research_notes)} outline=${has(j.outline)} draft=${has(j.draft_md)} meta=${has(j.metadata_json)} thumb=${has(j.thumb_url)} post_id=${has(j.post_id)}`
  );
  if (j.error) console.log(`  error: ${j.error}`);
  console.log(`  updated: ${j.updated_at}`);
}
