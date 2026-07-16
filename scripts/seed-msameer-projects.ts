/**
 * Seeds Supabase with Muhammad Sameer's real projects (from the CV).
 * Categories are domain-based: SaaS, E-Commerce, Social Commerce, Full-Stack.
 *
 * Prereq: run supabase/schema.sql in the Supabase SQL Editor first.
 * Run:    npx tsx scripts/seed-msameer-projects.ts
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
if (!URL_ || !SERVICE_KEY) {
  console.error("[seed] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
const sb = createClient(URL_, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/* ─── Categories ─── */
const CATEGORIES = [
  { name: "SaaS",            slug: "saas",            color: "#0e7490" },
  { name: "E-Commerce",      slug: "ecommerce",       color: "#d98a3d" },
  { name: "Social Commerce", slug: "social-commerce", color: "#3fbdd0" },
  { name: "Full-Stack",      slug: "full-stack",      color: "#0b5c73" },
];

/* ─── Helpers ─── */
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

const GALLERY = {
  education: [
    UNSPLASH("1522202176988-66273c2fd55f"),
    UNSPLASH("1577896851231-70ef18881754"),
    UNSPLASH("1503676260728-1c00da094a0b"),
    UNSPLASH("1509062522246-3755977927d7"),
  ],
  commerce: [
    UNSPLASH("1556742049-0cfed4f6a45d"),
    UNSPLASH("1601584115197-04ecc0da31d7"),
    UNSPLASH("1586528116311-ad8dd3c8310d"),
    UNSPLASH("1607082348824-0a96f2a4b9da"),
  ],
  social: [
    UNSPLASH("1677442136019-21780ecad995"),
    UNSPLASH("1611162617070-c1a2d1b7f4e5"),
    UNSPLASH("1611162616305-c69b3fa7fbe0"),
    UNSPLASH("1556155092-490a1ba16284"),
  ],
  tech: [
    UNSPLASH("1517245386807-bb43f82c33c4"),
    UNSPLASH("1551288049-bebda4e38f71"),
    UNSPLASH("1498050108023-c5249f4df085"),
    UNSPLASH("1460925895917-afdab827c52f"),
  ],
  shop: [
    UNSPLASH("1560179707-f14e90ef3623"),
    UNSPLASH("1556742049-0cfed4f6a45d"),
    UNSPLASH("1607082348824-0a96f2a4b9da"),
    UNSPLASH("1521295121783-8a321d551ad2"),
  ],
};

type Proj = {
  slug: string;
  title: string;
  description: string;
  long: string;
  category: string;
  tags: string[];
  thumb: string;
  gallery?: string[];
  year: number;
  role: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
};

/* ─── Project content (grounded in the CV) ─── */
const PROJECTS: Proj[] = [
  {
    slug: "nuxseed-saas",
    title: "NuxseedSaaS — Multi-Tenant School Management Platform",
    description:
      "A multi-tenant school management platform covering administration, finance/payroll and media broadcasting, with role-based web dashboards and a Flutter mobile app.",
    category: "SaaS",
    tags: ["NestJS", "Next.js", "React", "PostgreSQL", "Redis", "Flutter", "Docker", "AWS EC2"],
    thumb: UNSPLASH("1522202176988-66273c2fd55f"),
    gallery: GALLERY.education,
    year: 2025,
    role: "Full-Stack Software Engineer",
    featured: true,
    long: `NuxseedSaaS is a multi-tenant school management platform built to run the day-to-day operations of a school from one system — administration, finance and payroll, and media broadcasting — across multiple tenant roles.

On the backend I built NestJS / PostgreSQL modules for school administration, finance/payroll and media broadcasting, designed around clean service boundaries so each tenant's data stays isolated and each role only sees what it should. The web layer is a set of React / Next.js dashboards wired to the NestJS API and tailored per role.

The mobile side is a Flutter app covering the parts of school life that belong in a student's pocket — timetables, assignments and quizzes — secured with JWT authentication against the same API. The whole stack is containerised with Docker and nginx and deployed to AWS EC2 through a CI/CD pipeline, with Redis backing caching and background work.`,
  },
  {
    slug: "barqi-bazar",
    title: "BarqiBazar — Offline-First Commerce & Delivery Platform",
    description:
      "A commerce and delivery platform with a CouchDB/PouchDB point-of-sale that keeps taking orders through unreliable networks and reconciles cleanly on reconnect.",
    category: "E-Commerce",
    tags: ["NestJS", "PostgreSQL", "Redis", "RabbitMQ", "CouchDB / PouchDB", "Firebase", "Flutter", "AWS"],
    thumb: UNSPLASH("1601584115197-04ecc0da31d7"),
    gallery: GALLERY.commerce,
    year: 2025,
    role: "Backend & Mobile Engineer",
    featured: true,
    long: `BarqiBazar is a commerce and delivery platform built for markets where the network can't be trusted to stay up. The defining constraint was offline-first: a shop's point-of-sale has to keep taking orders through dead zones and reconcile cleanly the moment connectivity returns.

I built the NestJS / PostgreSQL backend services for vendor onboarding, product catalogue and wallet features, and engineered the offline-first POS flow on CouchDB / PouchDB with sync handling that treats conflicts as a product decision rather than an afterthought. RabbitMQ handles asynchronous work between services and Redis backs caching and queues.

On mobile, Flutter screens cover order placement and live delivery tracking via Firebase — so a customer watches their order move in real time while the vendor side keeps running locally even when the connection drops.`,
  },
  {
    slug: "advara",
    title: "Advara — AI-Powered Social Commerce Platform",
    description:
      "A social commerce platform blending social feeds and seller storefronts, powered by NestJS microservices with a Next.js web app and an Expo (React Native) mobile app.",
    category: "Social Commerce",
    tags: ["NestJS", "Next.js", "PostgreSQL", "Redis", "Firebase", "Expo", "React Native", "Docker"],
    thumb: UNSPLASH("1677442136019-21780ecad995"),
    gallery: GALLERY.social,
    year: 2025,
    role: "Full-Stack Software Engineer",
    featured: true,
    long: `Advara is an AI-powered social commerce platform that blends a social feed with seller storefronts — the kind of experience where discovery and buying live in the same scroll.

I built NestJS / PostgreSQL microservices powering the social-commerce features and developed the Next.js web UI for the social feeds and seller storefront pages. Redis backs caching and real-time concerns, while Firebase handles notifications and realtime data.

On mobile, I shipped the feed and notification features in the Expo (React Native) app, sharing the same service layer as the web so the experience stays consistent across platforms. The system is containerised with Docker and deployed on AWS.`,
  },
  {
    slug: "nexshare",
    title: "NexShare — Full-Stack Social Sharing App",
    description:
      "A full-stack social sharing app built with Next.js and MongoDB, with authentication and the core create-and-share feed loop.",
    category: "Full-Stack",
    tags: ["Next.js", "MongoDB", "TypeScript", "Authentication", "Full Stack"],
    thumb: UNSPLASH("1517245386807-bb43f82c33c4"),
    gallery: GALLERY.tech,
    year: 2024,
    role: "Full-Stack Developer",
    liveUrl: "https://nex-share.vercel.app",
    featured: false,
    long: `NexShare is a full-stack social sharing application built with Next.js and MongoDB. It covers the core of a social product — authentication, a content feed, and the create/share loop — implemented end-to-end from the data model through the interface.

The app uses Next.js for both the frontend and API routes, with MongoDB as the data store. Authentication gates the experience, and the feed is built around the create-and-share interactions that make a social app feel alive. It's one of the personal projects where I got to own every layer of a product from scratch.`,
  },
  {
    slug: "s-shop",
    title: "S-Shop — MERN E-Commerce Web App",
    description:
      "An e-commerce web app on the MERN stack with authentication and product and cart flows — a complete, working store rather than a static demo.",
    category: "E-Commerce",
    tags: ["React", "Node.js", "Express", "MongoDB", "MERN", "Ecommerce"],
    thumb: UNSPLASH("1560179707-f14e90ef3623"),
    gallery: GALLERY.shop,
    year: 2024,
    role: "Full-Stack Developer",
    liveUrl: "https://s-shop-beta.vercel.app",
    featured: false,
    long: `S-Shop is an e-commerce web application built on the MERN stack (MongoDB, Express, React, Node.js). It implements the essentials of an online store — authentication, product browsing, and cart flows — as a complete, working commerce experience.

React drives the storefront, an Express / Node.js API handles the business logic, and MongoDB stores products, users and carts. It was a deliberate end-to-end MERN build: real auth, real product and cart state, and a checkout-shaped flow rather than a static demo.`,
  },
];

/* ─── Main ─── */
async function main() {
  console.log("[seed-msameer] target:", URL_);

  // Wipe existing projects + project categories first (idempotent re-runs).
  console.log("[seed-msameer] wiping projects + project categories…");
  {
    const { error } = await sb
      .from("projects")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
  }
  {
    const { error } = await sb.from("categories").delete().eq("kind", "project");
    if (error) throw error;
  }

  // Insert categories.
  console.log(`[seed-msameer] inserting ${CATEGORIES.length} categories…`);
  const { data: insertedCats, error: catErr } = await sb
    .from("categories")
    .insert(CATEGORIES.map((c) => ({ ...c, kind: "project" as const })))
    .select("id, name");
  if (catErr) throw catErr;

  const catIdByName = new Map<string, string>();
  for (const c of insertedCats || []) catIdByName.set(c.name, c.id);

  // Insert projects.
  const now = new Date().toISOString();
  const rows = PROJECTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    long_description: p.long,
    category_id: catIdByName.get(p.category) || null,
    tags: p.tags,
    thumb_url: p.thumb,
    gallery_urls: p.gallery || [],
    year: p.year,
    role: p.role,
    live_url: p.liveUrl ?? null,
    repo_url: p.repoUrl ?? null,
    featured: p.featured,
    status: "published" as const,
    published_at: now,
    created_at: now,
    updated_at: now,
  }));

  console.log(`[seed-msameer] inserting ${rows.length} projects…`);
  const { error: pErr } = await sb.from("projects").insert(rows);
  if (pErr) throw pErr;

  const head = { count: "exact" as const, head: true };
  const [{ count: pc }, { count: cc }] = await Promise.all([
    sb.from("projects").select("id", head),
    sb.from("categories").select("id", head).eq("kind", "project"),
  ]);
  console.log(`[seed-msameer] ✓ projects=${pc}  categories=${cc}`);
}

main().catch((e) => {
  console.error("[seed-msameer] FAILED:", e);
  process.exit(1);
});
