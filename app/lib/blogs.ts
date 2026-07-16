export type BlogPost = {
  slug: string;
  title: string;
  /** One-line summary for the listing card. */
  excerpt: string;
  /** Multi-paragraph body for the detail page (legacy / static catalog). */
  body: string[];
  date: string; // displayed as-is, e.g. "12 Mar 2026"
  isoDate: string; // for <time> + ordering
  readTime: string; // e.g. "6 min"
  thumb: string;
  tags: string[];
  /** Raw markdown body — set for DB-backed posts. Rendered as rich
   *  markdown when present; legacy `body[]` paragraphs still used otherwise. */
  markdown?: string;
  /** Editorial flag — true posts are surfaced on the homepage. */
  featured?: boolean;
  /** DB-backed category name (e.g. "Engineering", "Personal"). Used
   *  to drive the filter pills on /blog. Static catalog entries leave
   *  this undefined. */
  category?: string;
  /** ISO timestamp of last DB update — used for sitemap `<lastmod>`. */
  updatedAt?: string;
};

const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

/**
 * Static blog catalog — Muhammad Sameer's writing, grounded in the real
 * systems from his work. Used as the fallback whenever Supabase has no
 * published posts; DB rows take over automatically once they exist.
 */
export const POSTS: BlogPost[] = [
  {
    slug: "offline-first-is-a-rule-not-a-feature",
    title: "Offline-First Is a Rule, Not a Feature",
    excerpt:
      "Building a point-of-sale for shops on unreliable networks taught me that sync conflicts are a product decision — not something you bolt on later.",
    body: [
      "I built the point-of-sale flow for BarqiBazar, a commerce and delivery platform, for a place where the network cannot be trusted to stay up. The shop still has to take the order when the connection is gone, and it has to reconcile cleanly the moment it comes back.",
      "That constraint changes everything. The local database — CouchDB / PouchDB in this case — becomes the source of truth the UI reads and writes, and the server becomes something the device syncs toward when it can, not something it waits on.",
      "The hard part isn't storing data offline. It's conflicts. Two devices edit the same order while both are offline — who wins? I learned to treat that as a product question, not a technical one: some fields are last-write-wins, some merge, some need a human. Decide it deliberately, or the data decides for you.",
      "The payoff is a POS that never freezes on a spinner and never loses a write — it behaves the same in a dead zone as it does on full bars. Offline-first isn't a feature you add. It's a rule you design around from the first table.",
    ],
    date: "19 Jun 2026",
    isoDate: "2026-06-19",
    readTime: "5 min",
    thumb: IMG("1518770660439-4636190af475"),
    tags: ["Offline-First", "CouchDB", "Architecture"],
    category: "Backend",
    featured: true,
  },
  {
    slug: "one-api-many-schools-multi-tenant-lessons",
    title: "One API, Many Schools: Lessons From a Multi-Tenant SaaS",
    excerpt:
      "On a school-management platform, every tenant shares the same code and infrastructure but must never see each other's data. Tenancy is a discipline you enforce at every layer.",
    body: [
      "NuxseedSaaS is a multi-tenant school management platform — administration, finance and payroll, media broadcasting — where every school runs on the same NestJS / PostgreSQL backend but must stay completely isolated from every other.",
      "The temptation early on is to sprinkle `where tenant_id = ?` across your queries and call it tenancy. That works until the one time you forget — and then one school sees another's payroll. So I pushed isolation down to a place it can't be forgotten: the data-access layer and row-level policies, not the individual query.",
      "Roles add a second axis. An admin, a teacher, and a finance officer in the same tenant see very different slices of the same data. I kept that in the API surface rather than the UI, so a dashboard can't accidentally request something the role isn't allowed to read.",
      "The lesson: multi-tenancy isn't a feature you build once. It's an invariant you protect at every layer — schema, access, API, UI — because the cost of getting it wrong even once is trust you don't get back.",
    ],
    date: "21 May 2026",
    isoDate: "2026-05-21",
    readTime: "6 min",
    thumb: IMG("1544383835-bda2bc66a55d"),
    tags: ["Multi-Tenant", "NestJS", "PostgreSQL"],
    category: "Architecture",
    featured: true,
  },
  {
    slug: "one-backend-three-surfaces-web-react-native-flutter",
    title: "One Backend, Three Surfaces: Web, React Native, and Flutter",
    excerpt:
      "Shipping the same product to a Next.js web app, a React Native app, and a Flutter app at once forces a clarity about where the logic actually lives.",
    body: [
      "I work across several concurrent products, and more than once the same feature has to land on a Next.js web dashboard, a React Native screen, and a Flutter screen. Three surfaces, one product.",
      "The only way that stays sane is to keep the logic on the server. The NestJS API owns the rules; the clients own presentation and interaction. If a client is making a business decision, that decision is in the wrong place.",
      "It also changes how you design endpoints. A screen-shaped API — one call that returns exactly what a screen needs — beats a chatty REST-purist one when you're feeding three different UIs that each want the data arranged their own way.",
      "React Native and Flutter each have their moment: React Native when the team already shares React muscle memory, Flutter when the UI is heavy and custom. But the backend doesn't care which one is calling — and that's exactly the point.",
    ],
    date: "16 Apr 2026",
    isoDate: "2026-04-16",
    readTime: "5 min",
    thumb: IMG("1633356122544-f134324a6cee"),
    tags: ["React Native", "Flutter", "API Design"],
    category: "Mobile",
    featured: true,
  },
  {
    slug: "the-nestjs-patterns-i-actually-reach-for",
    title: "The NestJS Patterns I Actually Reach For",
    excerpt:
      "Modules, providers, guards — the framework hands you a lot. Here's the small subset I keep returning to across production APIs.",
    body: [
      "NestJS gives you a generous toolbox. Across the production APIs I've shipped, I've ended up leaning on a small subset of it most of the time — and reaching for the rest only when a problem genuinely calls for it.",
      "Modules by feature, not by layer. Every feature gets a folder with its controller, service, a few DTOs and its tests. The `controllers/` + `services/` split reads well in a tutorial and falls apart around the tenth feature.",
      "Guards for auth, interceptors for logging, pipes for validation — that's the trinity that carries most of the weight. Custom decorators only when there's an obvious, repeated win, never for cleverness.",
      "And one rule that's saved me repeatedly: services don't call each other across feature boundaries directly. They go through events. It keeps features from quietly fusing into a monolith-inside-a-monolith.",
    ],
    date: "12 Mar 2026",
    isoDate: "2026-03-12",
    readTime: "6 min",
    thumb: IMG("1555066931-4365d14bab8c"),
    tags: ["NestJS", "Backend", "Patterns"],
    category: "Backend",
  },
  {
    slug: "reach-for-a-queue-before-microservices",
    title: "Reach for a Queue Before You Reach for Microservices",
    excerpt:
      "Most of the reliability people chase with microservices, they can get from a monolith and an honest queue. The work was always asynchronous — the queue just admits it.",
    body: [
      "When a monolith starts hurting, the reflex is to reach for microservices. More often, the thing that actually hurts is a handful of request paths pretending to be synchronous when they never were.",
      "Emails, exports, notifications, third-party fan-out, reconciliation — none of that needs to happen inside the user's request. Pushing it onto a queue (RabbitMQ, in the systems I've built) is the cheapest reliability win I know.",
      "You keep the simplicity of one deploy and one database, and you get back the two things you were really after: requests that stay fast, and background work that can retry without taking a user down with it.",
      "Microservices are a real tool with a real cost — network boundaries, deploys, observability, distributed failure. Reach for a queue first. Reach for services only when the queue genuinely isn't enough.",
    ],
    date: "13 Feb 2026",
    isoDate: "2026-02-13",
    readTime: "5 min",
    thumb: IMG("1556761175-b413da4baf72"),
    tags: ["Backend", "Reliability", "RabbitMQ"],
    category: "Architecture",
  },
  {
    slug: "kotli-the-internet-and-learning-to-build",
    title: "Kotli, the Internet, and Learning to Build",
    excerpt:
      "A short note on building a career from Kotli, Azad Kashmir — where the connection drops more than it should, and why that turned out to be an advantage.",
    body: [
      "I write this from Kotli, in Azad Kashmir. The internet here is good most days, fine most others, and gone for stretches nobody can predict.",
      "I learned to build software in those gaps. You learn quickly that 'works on my machine' isn't funny when your machine might be the only thing working for the next few hours — and that a product which falls over the moment the network blinks isn't really finished.",
      "That shaped how I think. Offline-first isn't a buzzword to me — it's a default. Graceful degradation isn't a nice-to-have — it's the point. The user shouldn't feel the network blink, and they should never lose work to it.",
      "Most software is built where the network is taken for granted. Building from a place where it isn't has, somehow, been an unfair advantage.",
    ],
    date: "15 Jan 2026",
    isoDate: "2026-01-15",
    readTime: "4 min",
    thumb: IMG("1462206092226-f46025ffe607"),
    tags: ["Personal", "Kashmir", "Offline-First"],
    category: "Personal",
  },
];
