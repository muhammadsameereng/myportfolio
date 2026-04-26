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

export const PROJECTS: Project[] = [
  {
    slug: "multi-tenant-lms",
    title: "Multi-Tenant Learning Management System",
    description:
      "A SaaS LMS that lets each institute brand, configure, and run their own classrooms — without forking the codebase.",
    longDescription: [
      "Built from the database up around a clean tenancy model: every school, training company, or coaching academy gets its own isolated workspace, custom domain, branding, and billing — running on shared infrastructure.",
      "Onboarding a new tenant takes a three-field form. Course authoring, live classes, assignments, attendance, and progress reports all flow through a single API surface I designed to be boring on purpose — easy to evolve, easy to test.",
    ],
    category: "SaaS",
    tags: ["NestJS", "PostgreSQL", "Redis", "Next.js", "TypeScript"],
    thumb:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80&auto=format&fit=crop",
    year: 2025,
    role: "Lead full-stack engineer",
    liveUrl: "#",

    techStack: [
      { name: "TypeScript" },
      { name: "Next.js" },
      { name: "NestJS" },
      { name: "PostgreSQL" },
      { name: "Redis" },
      { name: "Docker" },
      { name: "Stripe" },
    ],
    overview: [
      "I joined the project as the second engineer with the opportunity to take an existing single-tenant LMS and rebuild it as a true multi-tenant SaaS. The goal was simple — let any institute, training company, or coaching academy run their own classrooms on shared infrastructure, without forking code or duplicating ops.",
      "The challenge was less about features and more about isolation, customisation, and onboarding. Every tenant needed their own brand, domain, billing, and data — but the platform team needed exactly one codebase to maintain.",
    ],
    objectives: [
      "Design a tenancy model that scales to hundreds of institutes on shared infrastructure.",
      "Reduce onboarding from a week of setup to a self-serve three-field form.",
      "Provide deep theming and configuration without giving any tenant access to code.",
      "Keep the API surface boring and predictable so feature work doesn't slow down over time.",
    ],
    domain: [
      "Education-tech is full of platforms that look the same on the outside and behave very differently on the inside. Some institutes care about live classes; some care about assignments; some care almost entirely about attendance and report cards for parents.",
      "We needed a model where each of those flavours felt like a first-class product — same engine, different surfaces. The shape of the data, the role of the tenant admin, and the rituals of the school calendar all shaped the design more than any framework choice did.",
    ],
    features: [
      {
        title: "Tenant Onboarding",
        description:
          "A self-serve flow where a new institute picks a subdomain, uploads a logo, sets a brand colour, and is in their own workspace within minutes — fully provisioned, zero ops involvement.",
        images: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80&auto=format&fit=crop",
        ],
      },
      {
        title: "Course Authoring & Live Classes",
        description:
          "A clean drag-and-drop course authoring tool, paired with a stable live-class layer that handles attendance, breakout rooms, and recording — all surfaced through the same student dashboard.",
        images: [
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80&auto=format&fit=crop",
        ],
      },
      {
        title: "Reporting & Analytics",
        description:
          "Daily, weekly, and term-level reports on attendance, assignments, performance, and engagement — exportable to PDF, schedulable over email, and drillable down to a single student.",
        images: [
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80&auto=format&fit=crop",
        ],
      },
      {
        title: "Multi-Tenant Billing",
        description:
          "Stripe-backed billing with per-tenant plans, prorated upgrades, and proper invoicing — the platform team sees one consolidated revenue dashboard, while each institute sees only their own.",
        images: [
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=1600&q=80&auto=format&fit=crop",
        ],
      },
    ],
    outcome: [
      "The platform now hosts dozens of institutes on a single deployment. New tenants self-serve onboarding in under five minutes, brand their workspace fully, and spin up their first cohort the same day.",
      "Operationally, the platform team went from spending most of a week per institute to spending almost nothing — onboarding is fully automated and incidents are scoped to a single tenant by design.",
      "Revenue follows usage cleanly, billing is reconciled automatically, and feature work no longer slows down as the number of institutes grows.",
    ],
    conclusion: [
      "The hardest part of building a multi-tenant SaaS isn't the features — it's the discipline. Every shortcut you take in tenancy, isolation, or configuration shows up months later as an outage or a migration nightmare.",
      "By keeping the data model boring and the API surface narrow, the system has stayed easy to evolve. Onboarding stays fast, customer trust stays high, and the team can ship features instead of fighting fires.",
    ],
  },
  {
    slug: "clinic-desktop-app",
    title: "Offline-First Clinic Desktop Application",
    description:
      "A desktop tool that works in silence — keeps working when the fibre goes out, and syncs when it comes back.",
    longDescription: [
      "Designed for a real clinic in the valley where the internet is patchy. Patient records, appointments, prescriptions, billing — everything functions locally first, with conflict-aware sync to the cloud the moment connectivity returns.",
      "Built on Electron + SQLite locally, with a NestJS sync server. The team got back about six hours a week of manual reconciliation work that they used to do by hand.",
    ],
    category: "Desktop",
    tags: ["Electron", "SQLite", "TypeScript", "NestJS"],
    thumb:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1600&q=80&auto=format&fit=crop",
    year: 2024,
    role: "Solo engineer",
  },
  {
    slug: "multi-vendor-marketplace",
    title: "Multi-Vendor E-Commerce Marketplace",
    description:
      "A marketplace where dozens of small vendors run independent storefronts on shared infrastructure.",
    longDescription: [
      "Each vendor manages their own products, orders, payouts, and customer messages — but the platform handles checkout, payments, taxes, shipping rules, and analytics centrally.",
      "Designed the multi-vendor data model, the order-splitting and payout pipeline, and the vendor admin. Optimised for a couple of thousand SKUs with zero ops overhead per vendor.",
    ],
    category: "E-Commerce",
    tags: ["Next.js", "Sanity", "Stripe", "PostgreSQL", "TypeScript"],
    thumb:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80&auto=format&fit=crop",
    year: 2025,
    role: "Full-stack engineer",
    liveUrl: "#",
  },
  {
    slug: "voltek-marketing-site",
    title: "Voltek — High-Performance Marketing Website",
    description:
      "Marketing site for a US-based engineering shop, built for fast loads and clear storytelling.",
    longDescription: [
      "A content-heavy marketing site that scores green across Lighthouse and reads like a clean magazine on every device. Custom MDX content pipeline, prefetched routes, and aggressively optimised media.",
      "I led the build, the brand-page system, and the migration of the old WordPress site without breaking a single inbound link.",
    ],
    category: "Web",
    tags: ["Next.js", "MDX", "Tailwind", "TypeScript"],
    thumb:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80&auto=format&fit=crop",
    year: 2026,
    role: "Engineering lead",
    liveUrl: "https://voltekit.com",
  },
  {
    slug: "realtime-sync-engine",
    title: "Real-Time Sync Engine for Mobile + Web",
    description:
      "An event log between mobile and web that treats every connection as temporary and every write as a small, durable promise.",
    longDescription: [
      "Built so users can keep working — book, edit, scan, complete — even when the network drops mid-request. Writes are queued, deduplicated, replayed, and reconciled with a server-authoritative log.",
      "Cut p95 sync latency from 1.4s to 280ms, and eliminated the 'lost write on reconnect' class of bug that had been haunting the team for months.",
    ],
    category: "SaaS",
    tags: ["NestJS", "Redis", "React Native", "TypeScript", "WebSockets"],
    thumb:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80&auto=format&fit=crop",
    year: 2025,
    role: "Backend lead",
  },
  {
    slug: "healthcare-trust-center",
    title: "Healthcare Trust Center & Compliance Dashboard",
    description:
      "A compliance dashboard that turns months of audit prep into a one-screen status check.",
    longDescription: [
      "Aggregates security policies, third-party reports, sub-processor lists, data-residency facts, and incident history into a single public-facing page customers can self-serve.",
      "Internally, the back office surfaces gaps and renewals before they become problems. Built to be embedded into the company's main marketing site as a micro-frontend.",
    ],
    category: "Web",
    tags: ["Next.js", "PostgreSQL", "TypeScript", "Tailwind"],
    thumb:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80&auto=format&fit=crop",
    year: 2026,
    role: "Frontend engineer",
  },
  {
    slug: "pos-mobile-app",
    title: "Point-of-Sale Mobile Application",
    description:
      "A pocket POS for small retailers — scan, charge, print, repeat.",
    longDescription: [
      "Designed for shops that don't want a counter computer. Bluetooth scanner integration, thermal-printer support, and a one-tap settlement flow.",
      "Works fully offline; settles to the cloud whenever the device sees a connection. A pleasure to use for the staff because there's almost nothing on the screen at any moment.",
    ],
    category: "Mobile",
    tags: ["React Native", "TypeScript", "SQLite"],
    thumb:
      "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=1600&q=80&auto=format&fit=crop",
    year: 2024,
    role: "Mobile engineer",
  },
  {
    slug: "clinic-reporting",
    title: "Clinic Reporting & Analytics Suite",
    description:
      "Daily, weekly, monthly reports for clinics that previously did all of this in Excel.",
    longDescription: [
      "Patient flow, revenue by service, doctor-level KPIs, repeat-visit cohorts, no-show analytics — all of it generated from the same operational database the clinic already uses.",
      "Reports export to PDF, schedule themselves over email, and drill all the way down to a single appointment. Built so a non-technical manager can answer their own questions.",
    ],
    category: "Desktop",
    tags: ["Electron", "TypeScript", "SQLite", "Recharts"],
    thumb:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80&auto=format&fit=crop",
    year: 2024,
    role: "Solo engineer",
  },
  {
    slug: "inventory-manager",
    title: "Inventory & Stock Management Tool",
    description:
      "A desktop tool that quietly tracks stock across multiple branches without slowing anyone down.",
    longDescription: [
      "Real-time stock counts, low-stock alerts, and inter-branch transfers. Built to live alongside the existing POS and accounting tools, not replace them.",
      "Sync runs in the background; conflict resolution prefers the most recent physical count. Audit log keeps every change traceable to a human.",
    ],
    category: "Desktop",
    tags: ["Electron", "SQLite", "TypeScript"],
    thumb:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80&auto=format&fit=crop",
    year: 2023,
    role: "Solo engineer",
  },
  {
    slug: "restaurant-ordering",
    title: "Restaurant Online Ordering Platform",
    description:
      "An online-ordering platform with a kitchen display system on the other end.",
    longDescription: [
      "Customers order from a clean menu page; the kitchen sees a colour-coded queue with timers; the manager gets a live dashboard.",
      "Designed around the staff workflow, not the marketing pitch. Reduced order errors by giving the kitchen the exact same words the customer saw.",
    ],
    category: "E-Commerce",
    tags: ["Next.js", "PostgreSQL", "Stripe", "TypeScript"],
    thumb:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1600&q=80&auto=format&fit=crop",
    year: 2024,
    role: "Full-stack engineer",
  },
  {
    slug: "notes-tasks-pwa",
    title: "Notes & Tasks — Offline-First PWA",
    description:
      "A small notes-and-tasks PWA built for the kind of phone signal you get in a valley.",
    longDescription: [
      "Local-first storage in IndexedDB, background sync via service workers, conflict resolution via last-write-wins with a soft merge for text fields.",
      "Installable on every platform from a single PWA. A weekend project that turned into something I actually use every day.",
    ],
    category: "Web",
    tags: ["React", "IndexedDB", "Service Workers", "TypeScript"],
    thumb:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80&auto=format&fit=crop",
    year: 2025,
    role: "Side project",
    repoUrl: "https://github.com/saranzafar",
  },
  {
    slug: "field-service-app",
    title: "Field-Service Mobile App for Technicians",
    description:
      "A mobile app for technicians who spend their day on rooftops, in basements, and in dead-zones.",
    longDescription: [
      "Job tickets, photo-evidence capture, signed completion forms, and parts inventory — all functioning fully offline. The dispatcher's web console syncs whenever a tech regains signal.",
      "Designed with thick-glove ergonomics in mind: bigger tap targets, fewer screens, very little typing.",
    ],
    category: "Mobile",
    tags: ["React Native", "TypeScript", "WatermelonDB"],
    thumb:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80&auto=format&fit=crop",
    year: 2024,
    role: "Mobile + backend engineer",
  },
];

