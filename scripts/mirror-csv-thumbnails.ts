/**
 * Mirrors project thumbnails hosted on the *previous* portfolio's
 * Supabase project (aigxthlovwdhytxmdqpn) into THIS project's `media`
 * bucket so we no longer depend on infrastructure we don't own.
 *
 * - Finds every `projects` row whose `thumb_url` is on the foreign host.
 * - Downloads the image, uploads it to `media/projects/<slug>.<ext>`.
 * - Updates the row's `thumb_url` to the new public URL.
 *
 * Idempotent: re-runs are safe — already-mirrored rows are skipped.
 *
 * Usage:
 *   npx tsx scripts/mirror-csv-thumbnails.ts
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

const BUCKET = "media";
const FOREIGN_HOST = "aigxthlovwdhytxmdqpn.supabase.co";
const ownPublicPrefix = `${URL_}/storage/v1/object/public/${BUCKET}/`;

function extFromUrl(u: string): string {
  const m = u.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
  return (m?.[1] || "png").toLowerCase();
}

function contentTypeFor(ext: string): string {
  switch (ext) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

async function main() {
  const { data: rows, error } = await sb
    .from("projects")
    .select("id, slug, thumb_url");
  if (error) throw error;
  if (!rows) {
    console.log("[mirror] no projects");
    return;
  }

  const targets = rows.filter((r) => (r.thumb_url || "").includes(FOREIGN_HOST));
  console.log(`[mirror] ${targets.length} project(s) reference ${FOREIGN_HOST}`);
  if (targets.length === 0) return;

  let mirrored = 0;
  let failed = 0;

  for (const row of targets) {
    const src: string = row.thumb_url;
    const ext = extFromUrl(src);
    const key = `projects/${row.slug}.${ext}`;
    try {
      // Download
      const res = await fetch(src);
      if (!res.ok) throw new Error(`fetch ${res.status} ${res.statusText}`);
      const buf = Buffer.from(await res.arrayBuffer());

      // Upload — upsert so re-runs overwrite cleanly
      const { error: upErr } = await sb.storage
        .from(BUCKET)
        .upload(key, buf, {
          contentType: contentTypeFor(ext),
          upsert: true,
          cacheControl: "31536000",
        });
      if (upErr) throw upErr;

      const newUrl = `${ownPublicPrefix}${key}`;
      const { error: dbErr } = await sb
        .from("projects")
        .update({ thumb_url: newUrl })
        .eq("id", row.id);
      if (dbErr) throw dbErr;

      console.log(`  ✓ ${row.slug} → ${key}`);
      mirrored++;
    } catch (e) {
      console.error(`  ✗ ${row.slug} — ${(e as Error).message}`);
      failed++;
    }
  }

  console.log(`\n[mirror] done. mirrored=${mirrored} failed=${failed}`);
}

main().catch((e) => {
  console.error("[mirror] FAILED:", e);
  process.exit(1);
});
