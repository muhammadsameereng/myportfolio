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
};

export const POSTS: BlogPost[] = [
  {
    slug: "why-i-stopped-reaching-for-the-monolith-first",
    title: "Why I Stopped Reaching for the Monolith First",
    excerpt:
      "Queues aren't clever. They're just honest about the parts of your system that were always asynchronous — whether you admitted it or not.",
    body: [
      "For years my reflex when starting a new project was to build a monolith. Single repo, single deploy, single database. It's the fastest path to a running product, and for most teams it's the right answer.",
      "But somewhere along the way I noticed a pattern: every monolith I shipped that grew past a certain size eventually grew the same set of pain points — the same kind of long, gnarly request paths that did three things at once, the same retry-and-timeout dance around a slow third-party API, the same Tuesday-morning incidents where one feature took the whole app down.",
      "The thing that broke the pattern wasn't microservices. It was just queues. The honest acknowledgement that some work in your system was never really synchronous in the first place — emails, exports, indexing, billing reconciliation, third-party fan-out — and pretending otherwise was costing you reliability.",
      "So now my default has shifted. I still start with a monolith. But the moment I see code that says 'wait for this thing that doesn't really need to happen right now,' I reach for a queue. It's the cheapest reliability win I know.",
    ],
    date: "12 Mar 2026",
    isoDate: "2026-03-12",
    readTime: "6 min",
    thumb:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80&auto=format&fit=crop",
    tags: ["Distributed Systems", "Backend", "Reliability"],
  },
  {
    slug: "kashmir-the-internet-and-the-long-path-here",
    title: "Kashmir, the Internet, and the Long Path Here",
    excerpt:
      "A short note on building a career from a place where the internet goes down more than it should, and why it shapes the way I think about reliability.",
    body: [
      "I write this from Kotli, a small valley town in Azad Jammu and Kashmir. The internet here is good most days, fine most other days, and gone for stretches that nobody can predict.",
      "I learned to build software in those gaps. I learned that 'works on my machine' isn't a joke when 'my machine' might be the only place anything is working at all for the next six hours.",
      "That experience shaped a lot of how I think now. Offline-first isn't a buzzword to me — it's a rule. Graceful degradation isn't a nice-to-have — it's the whole point. The user shouldn't notice when the network blinks, and they definitely shouldn't lose work.",
      "Most software is built in places where the network is taken for granted. Building from a place where it isn't has been, somehow, an unfair advantage.",
    ],
    date: "04 Feb 2026",
    isoDate: "2026-02-04",
    readTime: "4 min",
    thumb:
      "https://images.unsplash.com/photo-1462206092226-f46025ffe607?w=1600&q=80&auto=format&fit=crop",
    tags: ["Personal", "Reliability", "Kashmir"],
  },
  {
    slug: "the-nestjs-patterns-i-actually-reach-for",
    title: "The NestJS Patterns I Actually Reach For",
    excerpt:
      "Modules, providers, guards — the framework gives you a lot. Here's the small subset I keep returning to after twenty production apps.",
    body: [
      "NestJS gives you a generous toolbox. After a few years and a few dozen apps in production, I've ended up using a small subset of it most of the time — and the rest only when I really need it.",
      "Modules-by-feature, not modules-by-layer. Every feature gets a folder, a controller, a service, a few DTOs, and a handful of tests. No 'controllers/', no 'services/' — those structures don't survive past about ten features.",
      "Guards for auth, interceptors for logging, pipes for validation. That's the trinity. Custom decorators only when there's an obvious win, and never for the sake of cleverness.",
      "And one rule that's saved me more times than I can count: services don't talk to other services across feature boundaries. They go through events.",
    ],
    date: "18 Jan 2026",
    isoDate: "2026-01-18",
    readTime: "8 min",
    thumb:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80&auto=format&fit=crop",
    tags: ["NestJS", "Backend", "Patterns"],
  },
  {
    slug: "calm-software-for-loud-industries",
    title: "Calm Software for Loud Industries",
    excerpt:
      "There's a quiet kind of software that doesn't ask for attention. The trick is figuring out where to put the noise instead.",
    body: [
      "Some industries are loud — high-volume, time-sensitive, full of edge cases that show up at 3 AM. The temptation when building software for them is to make the software loud too: alerts, dashboards, notifications, popups.",
      "I find the better software is the opposite. It does the noisy work in the background and presents the human with as few decisions as possible.",
      "That's hard. It means building real defaults, real error handling, real graceful degradation — instead of farming all of it out to the user as a popup.",
    ],
    date: "02 Jan 2026",
    isoDate: "2026-01-02",
    readTime: "5 min",
    thumb:
      "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=1600&q=80&auto=format&fit=crop",
    tags: ["Product", "UX", "Backend"],
  },
  {
    slug: "tailwind-css-after-three-years",
    title: "Tailwind CSS After Three Years",
    excerpt:
      "After 30+ projects on Tailwind, here's what I'd tell my past self about utility-first CSS.",
    body: [
      "I was sceptical of Tailwind for a long time. The class lists looked ugly, the learning curve looked weird, and 'utility-first' sounded like a fancy way of saying 'inline styles'.",
      "Three years and 30+ projects later, I work in it without thinking, and reach for any other styling system only when I have a specific reason to.",
      "What changed me wasn't a single feature. It was the realisation that 'where do I write this class?' had stopped being a question I had to answer. The class lives next to the markup. That's the whole pitch.",
    ],
    date: "15 Dec 2025",
    isoDate: "2025-12-15",
    readTime: "5 min",
    thumb:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80&auto=format&fit=crop",
    tags: ["CSS", "Tailwind", "Frontend"],
  },
  {
    slug: "shipping-as-a-team-of-one",
    title: "Shipping as a Team of One",
    excerpt:
      "How I structure my week when I'm the engineer, the designer, the support team, and the salesperson.",
    body: [
      "Most of my career has been on small teams or as a solo engineer for a client. The patterns I've picked up don't show up in the productivity blogs, but they save me weekly.",
      "Pick one thing. Ship it. Move on. The job of a solo engineer isn't to do many things at once — it's to finish one thing at a time and not lose your footing on the small stuff.",
      "Set boundaries with clients early and lovingly. Most timeline pain comes from saying yes to the wrong thing in the first ten minutes of a kickoff call.",
    ],
    date: "28 Nov 2025",
    isoDate: "2025-11-28",
    readTime: "7 min",
    thumb:
      "https://images.unsplash.com/photo-1499914485622-a88fac536970?w=1600&q=80&auto=format&fit=crop",
    tags: ["Career", "Productivity", "Solo"],
  },
  {
    slug: "the-quiet-power-of-feature-flags",
    title: "The Quiet Power of Feature Flags",
    excerpt:
      "A small, well-placed flag can save you a deployment, an outage, and a lot of unnecessary stress.",
    body: [
      "Feature flags get a lot of attention as a way to roll out experiments. That's fine, but it's the boring uses I value most.",
      "A flag around a risky migration. A flag that lets you turn off a vendor at 2 AM without waking up an engineer. A flag that gives a single customer access to a feature you wouldn't yet ship to everyone.",
      "Used well, flags are the difference between a deploy being a heart-pounding event and a quiet rollout.",
    ],
    date: "10 Nov 2025",
    isoDate: "2025-11-10",
    readTime: "4 min",
    thumb:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1600&q=80&auto=format&fit=crop",
    tags: ["Backend", "Reliability", "Patterns"],
  },
  {
    slug: "design-systems-for-small-teams",
    title: "Design Systems for Small Teams",
    excerpt:
      "You don't need a 60-component library to have a design system. You need three good primitives and the discipline to actually use them.",
    body: [
      "I've watched teams of four engineers try to maintain a 60-component design system. It always ends the same way: the system is half-broken, half-ignored, and full of one-off variants.",
      "What works on a small team is usually three things: a real type scale, a real spacing scale, and a small handful of well-thought-out primitives (button, input, card). The rest can be local.",
      "The discipline isn't in the library — it's in saying no when somebody wants to introduce a fourth button variant.",
    ],
    date: "22 Oct 2025",
    isoDate: "2025-10-22",
    readTime: "6 min",
    thumb:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1600&q=80&auto=format&fit=crop",
    tags: ["Design", "UX", "Frontend"],
  },
  {
    slug: "writing-better-postgres-migrations",
    title: "Writing Better Postgres Migrations",
    excerpt:
      "Most migration pain is self-inflicted. A few small habits will save you a thousand-line revert at midnight.",
    body: [
      "Migrations are one of those things every backend engineer ends up doing, and most of us learn the hard way.",
      "A few habits I've ended up with: never combine schema and data changes in one migration; never assume the migration runs against an empty table; always write the down step, even if you'll never use it; and always test against a snapshot of production-like data.",
      "It's slower up front. It saves you the kind of midnight revert that scars an engineer for years.",
    ],
    date: "08 Oct 2025",
    isoDate: "2025-10-08",
    readTime: "8 min",
    thumb:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1600&q=80&auto=format&fit=crop",
    tags: ["PostgreSQL", "Backend", "Migrations"],
  },
  {
    slug: "react-server-components-i-finally-get-it",
    title: "React Server Components: I Finally Get It",
    excerpt:
      "It took me almost a year to stop fighting RSCs and start actually using them. Here's what unlocked it.",
    body: [
      "I'm late to the React Server Components party. I tried them, found them confusing, gave up, came back, gave up again. Late last year something clicked and now they're my default.",
      "What unlocked it was treating server components as the default, and only reaching for client components for the parts of the page that actually need to be interactive.",
      "It changed the mental model entirely. I now design the page from the server outward, instead of treating client-side JavaScript as the substrate.",
    ],
    date: "20 Sep 2025",
    isoDate: "2025-09-20",
    readTime: "7 min",
    thumb:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1600&q=80&auto=format&fit=crop",
    tags: ["React", "Next.js", "Frontend"],
  },
  {
    slug: "the-case-for-boring-tools",
    title: "The Case for Boring Tools",
    excerpt:
      "Boring tools are how you ship things that last. The novelty tax is real, and you pay it on every project.",
    body: [
      "There's a tension in every codebase between using the new shiny tool and using the boring one that's been around for ten years.",
      "I've ended up on the side of boring tools, almost always. Postgres over the trendy NoSQL of the year. Express or Nest over whatever framework launched last month. React over the latest signal-based experiment.",
      "It's not because the new things are bad. It's because the cost of a tool isn't the time to learn it — it's the time to debug it at 2 AM, the size of the community when you have a problem, and the question of whether it'll still exist in three years.",
    ],
    date: "05 Sep 2025",
    isoDate: "2025-09-05",
    readTime: "5 min",
    thumb:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1600&q=80&auto=format&fit=crop",
    tags: ["Engineering", "Tooling"],
  },
  {
    slug: "what-i-learned-from-25-clients",
    title: "What I Learned From 25 Clients",
    excerpt:
      "Twenty-five client projects later, here are the patterns I notice in the ones that go well — and the ones that don't.",
    body: [
      "I've taken on around 25 client projects so far. Some were great. Some were forgettable. A few taught me lessons I wouldn't have learned any other way.",
      "The clients I do my best work with share a few things: they trust the process, they say what they actually want instead of what they think they should want, and they treat me like a partner instead of a vendor.",
      "The ones that go badly usually have one of three problems — unclear scope, hidden decision-makers, or a refusal to make hard product calls. Those problems are nobody's fault, but they're also fixable in the first conversation.",
    ],
    date: "18 Aug 2025",
    isoDate: "2025-08-18",
    readTime: "6 min",
    thumb:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80&auto=format&fit=crop",
    tags: ["Career", "Freelance"],
  },
];

