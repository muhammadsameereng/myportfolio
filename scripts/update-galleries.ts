/**
 * Updates `gallery_urls` for every existing project, keyed by slug.
 * Safe to re-run. Requires the `gallery_urls text[]` column to exist —
 * if it doesn't, run this SQL in Supabase → SQL Editor first:
 *
 *   alter table public.projects
 *     add column if not exists gallery_urls text[] not null default '{}';
 *
 * Usage: npx tsx scripts/update-galleries.ts
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

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

const G = {
  tech:           [U("1517245386807-bb43f82c33c4"), U("1551288049-bebda4e38f71"), U("1556761175-5973dc0f32e7"), U("1460925895917-afdab827c52f")],
  ai:             [U("1677442136019-21780ecad995"), U("1620712943543-bcc4688e7485"), U("1555255707-c07966088b7b"), U("1518770660439-4636190af475")],
  heritage:       [U("1488972685288-c3fd157d7c7a"), U("1520637836862-4d197d17c55a"), U("1545324418-cc1a3fa10c00"), U("1503387762-592deb58ef4e")],
  education:      [U("1522202176988-66273c2fd55f"), U("1577896851231-70ef18881754"), U("1503676260728-1c00da094a0b"), U("1509062522246-3755977927d7")],
  saas:           [U("1551288049-bebda4e38f71"), U("1460925895917-afdab827c52f"), U("1573164713988-8665fc963095"), U("1556761175-5973dc0f32e7")],
  hvac:           [U("1631545806609-fdc0eb6f2b8e"), U("1581094794329-c8112a89af12"), U("1545259742-b4fd8fea67e4"), U("1581092446327-9b52bd1570c2")],
  caribbean_food: [U("1546069901-ba9599a7e63c"), U("1565299624946-b28f40a0ae38"), U("1504674900247-0877df9cc836"), U("1555939594-58d7cb561ad1")],
  salads:         [U("1540420773420-3366772f4999"), U("1512621776951-a57141f2eefd"), U("1546069901-ba9599a7e63c"), U("1490645935967-10de6ba17061")],
  course:         [U("1611162616305-c69b3fa7fbe0"), U("1611162617213-7d7a39e9b1d7"), U("1574717024653-61fd2cf4d44d"), U("1522202176988-66273c2fd55f")],
  haircare:       [U("1560066984-138dadb4c035"), U("1522337360788-8b13dee7a37e"), U("1522335789203-aaaeae6c4d8d"), U("1599387737293-fbcd4f0a5c92")],
  healthcare:     [U("1576091160399-112ba8d25d1f"), U("1580281657527-47f249e8f4df"), U("1559757148-5c350d0d3c56"), U("1612349317150-e413f6a5b16d")],
  marketplace:    [U("1560179707-f14e90ef3623"), U("1521295121783-8a321d551ad2"), U("1578575437130-527eed3abbec"), U("1607082348824-0a96f2a4b9da")],
  dashboard:      [U("1551288049-bebda4e38f71"), U("1460925895917-afdab827c52f"), U("1543286386-713bdd548da4"), U("1556155092-490a1ba16284")],
  logistics:      [U("1601584115197-04ecc0da31d7"), U("1586528116311-ad8dd3c8310d"), U("1566576721346-d4a3b4eaeb55"), U("1586528116493-a029325540fa")],
  portfolio:      [U("1517180102446-f3ece451e9d8"), U("1498050108023-c5249f4df085"), U("1555066931-4365d14bab8c"), U("1581276879432-15e50529f34b")],
  restaurant:     [U("1555396273-367ea4eb4db5"), U("1517248135467-4c7edcad34c4"), U("1414235077428-338989a2e8c0"), U("1559339352-11d035aa65de")],
};

const MAP: Record<string, string[]> = {
  "logicexer":                  G.tech,
  "xactmind":                   G.ai,
  "turath":                     G.heritage,
  "peakpoint":                  G.education,
  "customerlift":               G.saas,
  "alvaircon":                  G.hvac,
  "islandboxmeals":             G.caribbean_food,
  "zestyzingsalads":            G.salads,
  "tiktok-herbals-course":      G.course,
  "nadeemshair":                G.haircare,
  "revlyticshealth":            G.healthcare,
  "afromarket":                 G.marketplace,
  "afromarket-admin":           G.dashboard,
  "hisglory-ai":                G.tech,
  "ad-transport-dubai":         G.logistics,
  "developer-portfolio-nextjs": G.portfolio,
  "khanakhazana":               G.restaurant,
};

async function main() {
  console.log("[update-galleries] target:", URL_);
  let ok = 0, miss = 0, fail = 0;
  for (const [slug, gallery] of Object.entries(MAP)) {
    const { error, count } = await sb
      .from("projects")
      .update({ gallery_urls: gallery }, { count: "exact" })
      .eq("slug", slug);
    if (error) {
      if (error.code === "PGRST204") {
        console.error(
          "[update-galleries] gallery_urls column missing — run this SQL first:\n" +
          "  alter table public.projects add column if not exists gallery_urls text[] not null default '{}';"
        );
        process.exit(2);
      }
      fail++;
      console.error(`[update-galleries] ${slug}: ${error.message}`);
    } else if (count === 0) {
      miss++;
      console.warn(`[update-galleries] ${slug}: no row matched`);
    } else {
      ok++;
    }
  }
  console.log(`[update-galleries] ✓ updated=${ok}  missing=${miss}  failed=${fail}`);
}

main().catch((e) => {
  console.error("[update-galleries] FAILED:", e);
  process.exit(1);
});
