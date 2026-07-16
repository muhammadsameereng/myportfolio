export type Category =
  | "SaaS"
  | "Web"
  | "Desktop"
  | "Mobile"
  | "E-Commerce";

export type StackItem = { name: string };

export type Feature = {
  title: string;
  description: string;
  images: string[];
};

export type Project = {
  slug: string;
  title: string;
  /** One-line summary for cards. */
  description: string;
  /** Multi-paragraph body for the detail page. */
  longDescription: string[];
  category: Category;
  tags: string[];
  thumb: string;
  year: number;
  role: string;
  liveUrl?: string;
  repoUrl?: string;
  /** Optional gallery of additional screenshots. Sourced from DB
   *  `gallery_urls` (text[]). Rendered as a clickable grid + lightbox
   *  on the detail page when non-empty. */
  gallery?: string[];

  /** Raw markdown body — rendered between the hero image and any
   *  legacy structured sections below. Sourced from DB long_description. */
  body?: string;
  /** Editorial flag — true rows are surfaced on the homepage. Only set
   *  for DB-backed projects; static catalog entries leave this undefined. */
  featured?: boolean;
  /** ISO timestamp of last DB update — used for sitemap `<lastmod>`. */
  updatedAt?: string;

  /* ── Optional case-study sections (rendered when present) ── */
  techStack?: StackItem[];
  overview?: string[];
  objectives?: string[];
  domain?: string[];
  features?: Feature[];
  outcome?: string[];
  conclusion?: string[];
};

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

/**
 * Static project catalog — Muhammad Sameer's real work (from the CV).
 * Used as the fallback whenever Supabase has no published projects, so the
 * site is populated out of the box. Once real rows exist in the DB, they
 * take over automatically (see app/lib/public/projects.ts).
 */
export const PROJECTS: Project[] = [
  {
    slug: "nuxseed-saas",
    title: "NuxseedSaaS — Multi-Tenant School Management Platform",
    description:
      "A multi-tenant school management platform covering administration, finance/payroll and media broadcasting, with role-based web dashboards and a Flutter mobile app.",
    longDescription: [
      "NuxseedSaaS is a multi-tenant school management platform built to run the day-to-day operations of a school from one system — administration, finance and payroll, and media broadcasting — across multiple tenant roles.",
      "On the backend I built NestJS / PostgreSQL modules for school administration, finance/payroll and media broadcasting, designed around clean service boundaries so each tenant's data stays isolated and each role only sees what it should. The web layer is a set of React / Next.js dashboards wired to the NestJS API and tailored per role.",
      "The mobile side is a Flutter app covering the parts of school life that belong in a student's pocket — timetables, assignments and quizzes — secured with JWT authentication against the same API. The whole stack is containerised with Docker and nginx and deployed to AWS EC2 through a CI/CD pipeline, with Redis backing caching and background work.",
    ],
    category: "SaaS",
    tags: ["NestJS", "Next.js", "React", "PostgreSQL", "Redis", "Flutter", "Docker", "AWS EC2"],
    thumb: UNSPLASH("1522202176988-66273c2fd55f"),
    gallery: [
      UNSPLASH("1577896851231-70ef18881754"),
      UNSPLASH("1503676260728-1c00da094a0b"),
      UNSPLASH("1509062522246-3755977927d7"),
    ],
    year: 2025,
    role: "Full-Stack Software Engineer",
    featured: true,
  },
  {
    slug: "barqi-bazar",
    title: "BarqiBazar — Offline-First Commerce & Delivery Platform",
    description:
      "A commerce and delivery platform with a CouchDB/PouchDB point-of-sale that keeps taking orders through unreliable networks and reconciles cleanly on reconnect.",
    longDescription: [
      "BarqiBazar is a commerce and delivery platform built for markets where the network can't be trusted to stay up. The defining constraint was offline-first: a shop's point-of-sale has to keep taking orders through dead zones and reconcile cleanly the moment connectivity returns.",
      "I built the NestJS / PostgreSQL backend services for vendor onboarding, product catalogue and wallet features, and engineered the offline-first POS flow on CouchDB / PouchDB with sync handling that treats conflicts as a product decision rather than an afterthought. RabbitMQ handles asynchronous work between services and Redis backs caching and queues.",
      "On mobile, Flutter screens cover order placement and live delivery tracking via Firebase — so a customer watches their order move in real time while the vendor side keeps running locally even when the connection drops.",
    ],
    category: "E-Commerce",
    tags: ["NestJS", "PostgreSQL", "Redis", "RabbitMQ", "CouchDB / PouchDB", "Firebase", "Flutter", "AWS"],
    thumb: UNSPLASH("1601584115197-04ecc0da31d7"),
    gallery: [
      UNSPLASH("1556742049-0cfed4f6a45d"),
      UNSPLASH("1586528116311-ad8dd3c8310d"),
      UNSPLASH("1607082348824-0a96f2a4b9da"),
    ],
    year: 2025,
    role: "Backend & Mobile Engineer",
    featured: true,
  },
  {
    slug: "advara",
    title: "Advara — AI-Powered Social Commerce Platform",
    description:
      "A social commerce platform blending social feeds and seller storefronts, powered by NestJS microservices with a Next.js web app and an Expo (React Native) mobile app.",
    longDescription: [
      "Advara is an AI-powered social commerce platform that blends a social feed with seller storefronts — the kind of experience where discovery and buying live in the same scroll.",
      "I built NestJS / PostgreSQL microservices powering the social-commerce features and developed the Next.js web UI for the social feeds and seller storefront pages. Redis backs caching and real-time concerns, while Firebase handles notifications and realtime data.",
      "On mobile, I shipped the feed and notification features in the Expo (React Native) app, sharing the same service layer as the web so the experience stays consistent across platforms. The system is containerised with Docker and deployed on AWS.",
    ],
    category: "Web",
    tags: ["NestJS", "Next.js", "PostgreSQL", "Redis", "Firebase", "Expo", "React Native", "Docker"],
    thumb: UNSPLASH("1677442136019-21780ecad995"),
    gallery: [
      UNSPLASH("1611162616305-c69b3fa7fbe0"),
      UNSPLASH("1556155092-490a1ba16284"),
      UNSPLASH("1551288049-bebda4e38f71"),
    ],
    year: 2025,
    role: "Full-Stack Software Engineer",
    featured: true,
  },
  {
    slug: "nexshare",
    title: "NexShare — Full-Stack Social Sharing App",
    description:
      "A full-stack social sharing app built with Next.js and MongoDB, with authentication and the core create-and-share feed loop.",
    longDescription: [
      "NexShare is a full-stack social sharing application built with Next.js and MongoDB. It covers the core of a social product — authentication, a content feed, and the create/share loop — implemented end-to-end from the data model through the interface.",
      "The app uses Next.js for both the frontend and API routes, with MongoDB as the data store. Authentication gates the experience, and the feed is built around the create-and-share interactions that make a social app feel alive. It's one of the personal projects where I got to own every layer of a product from scratch.",
    ],
    category: "Web",
    tags: ["Next.js", "MongoDB", "TypeScript", "Authentication", "Full Stack"],
    thumb: UNSPLASH("1517245386807-bb43f82c33c4"),
    gallery: [
      UNSPLASH("1498050108023-c5249f4df085"),
      UNSPLASH("1460925895917-afdab827c52f"),
    ],
    year: 2024,
    role: "Full-Stack Developer",
    liveUrl: "https://nex-share.vercel.app",
  },
  {
    slug: "s-shop",
    title: "S-Shop — MERN E-Commerce Web App",
    description:
      "An e-commerce web app on the MERN stack with authentication and product and cart flows — a complete, working store rather than a static demo.",
    longDescription: [
      "S-Shop is an e-commerce web application built on the MERN stack (MongoDB, Express, React, Node.js). It implements the essentials of an online store — authentication, product browsing, and cart flows — as a complete, working commerce experience.",
      "React drives the storefront, an Express / Node.js API handles the business logic, and MongoDB stores products, users and carts. It was a deliberate end-to-end MERN build: real auth, real product and cart state, and a checkout-shaped flow rather than a static demo.",
    ],
    category: "E-Commerce",
    tags: ["React", "Node.js", "Express", "MongoDB", "MERN", "Ecommerce"],
    thumb: UNSPLASH("1560179707-f14e90ef3623"),
    gallery: [
      UNSPLASH("1556742049-0cfed4f6a45d"),
      UNSPLASH("1521295121783-8a321d551ad2"),
    ],
    year: 2024,
    role: "Full-Stack Developer",
    liveUrl: "https://s-shop-beta.vercel.app",
  },
];
