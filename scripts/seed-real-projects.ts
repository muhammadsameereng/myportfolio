/**
 * Seeds Supabase with Saran Zafar's real client projects.
 * Categories are tech-based and minimal: WordPress, Next.js, React.
 *
 * Run: npx tsx scripts/seed-real-projects.ts
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

/* ─── Categories ─── */
const CATEGORIES = [
  { name: "WordPress", slug: "wordpress", color: "#21759b" },
  { name: "Next.js",   slug: "nextjs",    color: "#000000" },
  { name: "React",     slug: "react",     color: "#61dafb" },
  { name: "Django",    slug: "django",    color: "#0c4b33" },
];

/* ─── Helpers ─── */
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

const WP_WORKFLOW = `## How this project was built

Every WordPress engagement I run follows the same disciplined three-week rhythm, and this site was no exception:

- **Discovery.** Before a single line of CSS is written, I sit down with the client to understand the business, the audience and what success actually looks like. I gather the essentials — logo and brand assets, domain, hosting credentials — and align on scope and tone.
- **Week 1 — Phase 1 build.** I select a high-quality premium theme from Envato Elements that fits the brand, structure the information architecture, design the pages, and ship a working version 1 within seven days.
- **Week 2 — Review.** The client lives with the site, prepares a written feedback document and sends it back. This keeps revisions structured rather than scattered across messages.
- **Week 3 — Refinement and handoff.** I apply every revision, then run baseline SEO with Yoast SEO (free), tune Core Web Vitals, compress and lazy-load assets, configure caching, and hand off a site that is ready to grow.

The result is a website that does not just look good on launch day — it ranks, loads fast, and continues to perform after I step away.`;

type Proj = {
  slug: string;
  title: string;
  description: string;
  long: string;
  category: "WordPress" | "Next.js" | "React" | "Django";
  tags: string[];
  thumb: string;
  gallery?: string[];
  year: number;
  role: string;
  liveUrl?: string;
  featured: boolean;
};

/* ── Gallery image banks per theme (Unsplash) ── */
const GALLERY = {
  tech: [
    UNSPLASH("1517245386807-bb43f82c33c4"),
    UNSPLASH("1551288049-bebda4e38f71"),
    UNSPLASH("1556761175-5973dc0f32e7"),
    UNSPLASH("1460925895917-afdab827c52f"),
  ],
  ai: [
    UNSPLASH("1677442136019-21780ecad995"),
    UNSPLASH("1620712943543-bcc4688e7485"),
    UNSPLASH("1555255707-c07966088b7b"),
    UNSPLASH("1518770660439-4636190af475"),
  ],
  office: [
    UNSPLASH("1522071820081-009f0129c71c"),
    UNSPLASH("1556761175-5973dc0f32e7"),
    UNSPLASH("1542744173-8e7e53415bb0"),
    UNSPLASH("1497366216548-37526070297c"),
  ],
  heritage: [
    UNSPLASH("1488972685288-c3fd157d7c7a"),
    UNSPLASH("1520637836862-4d197d17c55a"),
    UNSPLASH("1545324418-cc1a3fa10c00"),
    UNSPLASH("1503387762-592deb58ef4e"),
  ],
  education: [
    UNSPLASH("1522202176988-66273c2fd55f"),
    UNSPLASH("1577896851231-70ef18881754"),
    UNSPLASH("1503676260728-1c00da094a0b"),
    UNSPLASH("1509062522246-3755977927d7"),
  ],
  saas: [
    UNSPLASH("1551288049-bebda4e38f71"),
    UNSPLASH("1460925895917-afdab827c52f"),
    UNSPLASH("1573164713988-8665fc963095"),
    UNSPLASH("1556761175-5973dc0f32e7"),
  ],
  hvac: [
    UNSPLASH("1631545806609-fdc0eb6f2b8e"),
    UNSPLASH("1581094794329-c8112a89af12"),
    UNSPLASH("1545259742-b4fd8fea67e4"),
    UNSPLASH("1581092446327-9b52bd1570c2"),
  ],
  caribbean_food: [
    UNSPLASH("1546069901-ba9599a7e63c"),
    UNSPLASH("1565299624946-b28f40a0ae38"),
    UNSPLASH("1504674900247-0877df9cc836"),
    UNSPLASH("1555939594-58d7cb561ad1"),
  ],
  salads: [
    UNSPLASH("1540420773420-3366772f4999"),
    UNSPLASH("1512621776951-a57141f2eefd"),
    UNSPLASH("1546069901-ba9599a7e63c"),
    UNSPLASH("1490645935967-10de6ba17061"),
  ],
  course: [
    UNSPLASH("1611162616305-c69b3fa7fbe0"),
    UNSPLASH("1611162617213-7d7a39e9b1d7"),
    UNSPLASH("1574717024653-61fd2cf4d44d"),
    UNSPLASH("1522202176988-66273c2fd55f"),
  ],
  haircare: [
    UNSPLASH("1560066984-138dadb4c035"),
    UNSPLASH("1522337360788-8b13dee7a37e"),
    UNSPLASH("1522335789203-aaaeae6c4d8d"),
    UNSPLASH("1599387737293-fbcd4f0a5c92"),
  ],
  healthcare: [
    UNSPLASH("1576091160399-112ba8d25d1f"),
    UNSPLASH("1580281657527-47f249e8f4df"),
    UNSPLASH("1559757148-5c350d0d3c56"),
    UNSPLASH("1612349317150-e413f6a5b16d"),
  ],
  marketplace: [
    UNSPLASH("1560179707-f14e90ef3623"),
    UNSPLASH("1521295121783-8a321d551ad2"),
    UNSPLASH("1578575437130-527eed3abbec"),
    UNSPLASH("1607082348824-0a96f2a4b9da"),
  ],
  dashboard: [
    UNSPLASH("1551288049-bebda4e38f71"),
    UNSPLASH("1460925895917-afdab827c52f"),
    UNSPLASH("1543286386-713bdd548da4"),
    UNSPLASH("1556155092-490a1ba16284"),
  ],
  logistics: [
    UNSPLASH("1601584115197-04ecc0da31d7"),
    UNSPLASH("1586528116311-ad8dd3c8310d"),
    UNSPLASH("1566576721346-d4a3b4eaeb55"),
    UNSPLASH("1586528116493-a029325540fa"),
  ],
  portfolio: [
    UNSPLASH("1517180102446-f3ece451e9d8"),
    UNSPLASH("1498050108023-c5249f4df085"),
    UNSPLASH("1555066931-4365d14bab8c"),
    UNSPLASH("1581276879432-15e50529f34b"),
  ],
  restaurant: [
    UNSPLASH("1555396273-367ea4eb4db5"),
    UNSPLASH("1517248135467-4c7edcad34c4"),
    UNSPLASH("1414235077428-338989a2e8c0"),
    UNSPLASH("1559339352-11d035aa65de"),
  ],
};

/* ─── Project content ─── */
const PROJECTS: Proj[] = [
  {
    slug: "logicexer",
    title: "Logicexer — Tech Solutions Company Website",
    description:
      "A corporate website for a Pakistan-based software firm offering web, mobile, custom software and automation services to growing businesses.",
    category: "WordPress",
    tags: ["WordPress", "Corporate Website", "Yoast SEO", "Envato", "Saran Zafar"],
    thumb: UNSPLASH("1522071820081-009f0129c71c"),
    year: 2024,
    role: "WordPress Developer",
    liveUrl: "https://logicexer.com/",
    featured: true,
    gallery: GALLERY.tech,
    long: `Logicexer is a tech solutions company based in Kotli, Azad Jammu & Kashmir that helps businesses modernise through custom web development, mobile applications, software engineering and web-scraping automation. They came to me needing a website that felt more like a credible engineering firm and less like a freelance landing page — something a CTO or procurement lead would feel comfortable forwarding internally.

The site is built on WordPress with a premium Envato Elements theme as the foundation, then rebuilt section by section to match the brand. The home page leads with a clear positioning statement, supports it with a focused services grid, and follows up with portfolio proof, team credibility and client testimonials. Internal pages are organised so each service tells its own story rather than collapsing into a single "we do everything" block, which is the trap most agency websites fall into.

Beyond layout, I focused heavily on the things that quietly determine whether a B2B website earns leads: clean URL structure, structured headings, fast image delivery, and properly configured metadata for every page using Yoast SEO. The Contact section pairs a working form with WhatsApp and email so prospects can reach the team in whatever channel they already prefer.

${WP_WORKFLOW}`,
  },

  {
    slug: "xactmind",
    title: "XactMind — AI & Software Consultancy",
    description:
      "A UK-based AI and software development firm serving healthcare, finance, logistics and government — built for credibility and enterprise lead generation.",
    category: "WordPress",
    tags: ["WordPress", "AI Consultancy", "B2B", "Yoast SEO", "Envato", "Saran Zafar"],
    thumb: UNSPLASH("1677442136019-21780ecad995"),
    year: 2024,
    role: "WordPress Developer",
    liveUrl: "https://xactmind.com/",
    featured: true,
    gallery: GALLERY.ai,
    long: `XactMind is a UK-based software and AI consultancy that delivers tailored solutions across healthcare, finance, manufacturing, logistics, banking and the public sector. Their service portfolio is genuinely deep — machine learning, NLP, generative AI chatbots, prompt engineering, data analytics, custom software, mobile and web — and the website needed to communicate that depth without overwhelming a first-time visitor.

I structured the site so a visitor can arrive on the home page, understand within seconds what XactMind does and who they serve, and then drill into the exact service or industry that brought them there. Each service page has a self-contained narrative — problem, approach, deliverables, outcomes — supported by case studies and partner logos (AWS, Microsoft Azure, Google Cloud) that quietly establish enterprise credibility. The leadership section gives the founding team the visibility a serious B2B buyer expects to see before booking a call.

A consultation request flow runs throughout the site: every page has a clear next step, and the form integrates with the team's existing inbox so no enquiry goes cold. I configured Yoast SEO across every service and industry page, optimised images for fast first paint, and made sure the experience is just as smooth on mobile — most decision-makers now read websites on their phones in the gaps between meetings.

${WP_WORKFLOW}`,
  },

  {
    slug: "turath",
    title: "Turath Al Husin — Heritage Construction in Sharjah",
    description:
      "Bilingual website for a 30-year-old UAE heritage construction and gypsum supply firm, balancing Arabic typography, traditional craftsmanship and modern UX.",
    category: "WordPress",
    tags: ["WordPress", "Bilingual", "Arabic RTL", "Construction", "Yoast SEO", "Saran Zafar"],
    thumb: UNSPLASH("1488972685288-c3fd157d7c7a"),
    year: 2024,
    role: "WordPress Developer",
    liveUrl: "https://turath.me/",
    featured: true,
    gallery: GALLERY.heritage,
    long: `Turath Al Husin LLC is a heritage construction company in Sharjah, UAE with more than thirty years of experience in restoration, traditional carpentry, gypsum work and building materials supply. Their projects involve chandal wood, palm fronds and Iranian gypsum imported directly from source — work that demands a website with the same sense of quality and tradition.

The biggest design challenge was the bilingual experience. The site runs in both English and Arabic, and the Arabic version is not an afterthought — RTL layouts, Arabic web fonts and properly mirrored UI elements were treated as first-class citizens. A visitor who lands on the Arabic version gets the same polish, the same image treatments and the same call-to-action paths as an English visitor.

The structure follows the way a heritage client actually evaluates a contractor: large, confident hero imagery that says "we have done serious work for thirty years", followed by clearly-organised service pages — heritage building, carpentry, materials supply, project management — each with project galleries that let the craftsmanship speak for itself. Social proof from Instagram and TikTok is woven in subtly, because for this kind of work, photo and video evidence is half the sales pitch.

${WP_WORKFLOW}`,
  },

  {
    slug: "peakpoint",
    title: "Peak Point — EdTech for At-Risk Students",
    description:
      "A Norwegian education-and-wellness platform helping schools reduce dropout through VR learning, mental resilience coaching and career guidance.",
    category: "WordPress",
    tags: ["WordPress", "EdTech", "Norwegian", "Education", "Yoast SEO", "Saran Zafar"],
    thumb: UNSPLASH("1522202176988-66273c2fd55f"),
    year: 2024,
    role: "WordPress Developer",
    liveUrl: "https://peakpoint.no/",
    featured: false,
    gallery: GALLERY.education,
    long: `Peak Point is a Bergen-based education and student-wellness organisation tackling one of Norway's quieter problems — school dropout among students who do not fit the conventional classroom mould. Their programmes range from "4 Life" (VR-based learning for students with school avoidance) and "Mentalt sterk" (mental resilience coaching) to an innovation hub and structured career guidance.

Because the audience is a mix of schools, parents and municipal partners, I designed the website to do two things at once: emotionally connect a parent or teacher with the human story behind each programme, and give a procurement-minded administrator the structure and credibility they need to make a decision. The home page leads with mission and values — quality, trust, innovation — then guides visitors into clearly-defined programme pages.

Each programme has its own page with its own tone, pulling together what the programme is, who it serves, how it is delivered and what outcomes look like. The whole experience is in Norwegian, so I worked with the client on copy review and used typographic choices that read well in Norwegian rather than defaulting to English-first patterns. Yoast SEO is configured per-page in Norwegian, not just translated, so the site can actually be found by the right audience.

${WP_WORKFLOW}`,
  },

  {
    slug: "customerlift",
    title: "CustomerLift — Customer Success Consultancy",
    description:
      "A premium SaaS-focused consulting site for a Customer Success operating-system practice working with €3M–€30M ARR companies in Ireland and Europe.",
    category: "WordPress",
    tags: ["WordPress", "SaaS", "Consulting", "B2B", "Yoast SEO", "Saran Zafar"],
    thumb: UNSPLASH("1551288049-bebda4e38f71"),
    year: 2024,
    role: "WordPress Developer",
    liveUrl: "https://customerlift.co/",
    featured: false,
    gallery: GALLERY.saas,
    long: `CustomerLift is a revenue systems consultancy for SaaS companies in the €3M–€30M ARR range. Founder Ben Ó Mathúin works with founders and Chief Revenue Officers to install Customer Success operating systems — covering foundations, sales-to-CS handoffs, activation, value realisation, renewal forecasting and expansion playbooks. The brand needed a website that read like a credible operator, not a generic agency.

The tone of the site was the most interesting design constraint. The audience is sceptical, time-poor and pattern-matched against hundreds of consulting websites. So instead of leading with stock-photo abstractions, the design leans into clarity: a sharp hero statement, a precise description of the six operating areas, an honest "who this is for / who this is not for" filter, and a visible Enterprise Ireland grant pathway worth up to €35,000 for eligible clients.

Underneath the visuals, the site is engineered for SaaS founders Googling specific pains — "customer success operating system", "activation measurement", "renewal forecasting". I structured the pages around those queries, configured Yoast SEO accordingly, and made sure the contact-to-call flow is as short as it can possibly be. Speed is dialled in tight, because a site selling operational maturity cannot afford to feel sluggish itself.

${WP_WORKFLOW}`,
  },

  {
    slug: "alvaircon",
    title: "ALV Aircon — Singapore HVAC Service (Redesign)",
    description:
      "A complete redesign of a Singapore air-conditioning service website, rebuilt around local SEO, neighbourhood pages and same-day booking.",
    category: "WordPress",
    tags: ["WordPress", "Redesign", "Local SEO", "HVAC", "Yoast SEO", "Saran Zafar"],
    thumb: UNSPLASH("1631545806609-fdc0eb6f2b8e"),
    year: 2024,
    role: "WordPress Developer",
    liveUrl: "https://alvaircon.com.sg/",
    featured: false,
    gallery: GALLERY.hvac,
    long: `ALV Aircon is a Singapore-based air-conditioning company offering chemical cleaning, gas top-ups, repairs, installations and maintenance contracts for residential, commercial and industrial customers. The previous site was outdated, slow and invisible in local search — so this engagement was a full redesign rather than a simple refresh.

The redesign was driven by two questions: how does a homeowner in Tampines actually search for aircon servicing, and what does the site need to do in the first ten seconds to win that booking? The new structure leads with a clear value proposition, prominent same-day service messaging, transparent pricing and a phone-first call to action. Beneath that, every neighbourhood in their service area gets its own dedicated page — the kind of local-SEO depth that compounds over months once Google has indexed it.

Service pages are laid out so a non-technical visitor can understand exactly what chemical cleaning is, what a gas top-up involves and why early diagnostics save money. Brand support for Daikin, Mitsubishi and other major manufacturers is visible up front. The booking flow is reduced to the minimum number of fields, and the whole site is configured with Yoast SEO, schema markup for local business, and image-and-cache optimisation so it loads fast on a 4G connection in a coffee break.

${WP_WORKFLOW}`,
  },

  {
    slug: "islandboxmeals",
    title: "Island Box Meals — Caribbean Meal Delivery",
    description:
      "A Toronto-area Jamaican meal-delivery brand: ready-to-eat meals, frozen options and catering, with a streamlined three-step ordering experience.",
    category: "WordPress",
    tags: ["WordPress", "Food Delivery", "Ecommerce", "Yoast SEO", "Saran Zafar"],
    thumb: UNSPLASH("1546069901-ba9599a7e63c"),
    year: 2024,
    role: "WordPress Developer",
    liveUrl: "https://islandboxmeals.ca/",
    featured: false,
    gallery: GALLERY.caribbean_food,
    long: `Island Box Meals is a Caribbean food delivery service operating across the Greater Toronto Area, Niagara, Hamilton, Brampton, Oakville and Mississauga. The kitchen specialises in authentic Jamaican homestyle cuisine — curry chicken, jerk chicken, oxtail, curry goat — sold as ready-to-eat meals, frozen meal kits, seasoned protein packs and catering for events.

The design challenge was sensory. People order Caribbean food because they crave it, and that craving has to come through the screen. I built the site around large, warm food photography, easy-to-skim meal cards with prices and portion sizes, and a clear delivery-radius story so visitors immediately know whether the brand serves their neighbourhood.

Underneath the visuals, the experience is engineered for conversion. The three-step process — order, fresh prep, delivery — is repeated subtly throughout the site so even a first-time visitor never feels lost. Free delivery on orders above $50 is positioned as a clear threshold rather than buried in the small print, and individual seasoned-protein packages give existing customers a reason to come back during the week. SEO is configured per dish and per service area so the site can be discovered the next time somebody types "best Jamaican food delivery Toronto".

${WP_WORKFLOW}`,
  },

  {
    slug: "zestyzingsalads",
    title: "Zesty Zing Salads — Quick-Casual Salad Brand",
    description:
      "A polished WordPress site for a chef-led salad brand and catering service, leaning into ingredient quality and grab-and-go convenience.",
    category: "WordPress",
    tags: ["WordPress", "Food", "Catering", "Yoast SEO", "Saran Zafar"],
    thumb: UNSPLASH("1540420773420-3366772f4999"),
    year: 2024,
    role: "WordPress Developer",
    liveUrl: "https://zestyzingsalads.com/",
    featured: false,
    gallery: GALLERY.salads,
    long: `Zesty Zing Salads is a quick-casual salad brand and catering company built around chef-crafted, locally-sourced ingredients. The menu mixes 16oz grab-and-go salads, seafood and chicken combinations, fruit pairings and corporate catering packages — all designed for people who want a clean, flavourful meal without giving up an hour of their day.

The brand voice is the heart of the site: bold flavour, real ingredients, no apologies. I leaned into that with strong food photography, confident typography and a clear separation between the everyday menu and the catering side of the business, because corporate catering buyers and lunchtime walk-ins behave very differently and expect very different journeys.

The site also doubles as a soft-sell engagement tool. Certifications and food-safety credentials are visible without being clinical, the chef's story is told without slipping into corporate-bio territory, and the email subscription system feeds a simple newsletter that keeps the brand on people's screens between visits. Yoast SEO is configured around the keywords that matter — salads, healthy lunch, catering — and image-heavy pages are tuned so they stay fast on mobile.

${WP_WORKFLOW}`,
  },

  {
    slug: "tiktok-herbals-course",
    title: "TikTok Mastery — Online Course Platform",
    description:
      "A course-driven WordPress site teaching TikTok creators how to build accounts, master SEO and grow viral organic traffic into revenue.",
    category: "WordPress",
    tags: ["WordPress", "Online Course", "LMS", "Creator Economy", "Saran Zafar"],
    thumb: UNSPLASH("1611162616305-c69b3fa7fbe0"),
    year: 2024,
    role: "WordPress Developer",
    liveUrl: "https://tiktok.herbalssupplements.com/",
    featured: false,
    gallery: GALLERY.course,
    long: `This is an online course platform built for an instructor teaching TikTok mastery — account creation, advanced TikTok SEO, viral content strategy and turning followers into real income. It is designed for creators and small businesses who want to take TikTok seriously instead of guessing at the algorithm.

The site is structured around the buying decision a prospective student actually goes through: who is this for, what will I actually learn, who is teaching me, and is anyone vouching for the result? The home page opens with a clear positioning statement, leads into modular course cards with iconography for each topic — content creation, SEO, growth — and is reinforced by five-star testimonials placed near every call to action.

Underneath the marketing surface, the platform is built to support real course delivery: structured lessons, drip-released content where appropriate, and an explore-courses navigation pattern that lets a single instructor add new programmes without breaking the information architecture. Performance, image optimisation and SEO foundations were all dialled in during the final week of the build so the funnel can scale with paid traffic without falling apart.

${WP_WORKFLOW}`,
  },

  {
    slug: "nadeemshair",
    title: "Nadeem's Hair — Haircare E-commerce Store",
    description:
      "A WooCommerce store for a haircare brand, designed for clean product browsing, trustworthy checkout and repeat purchases.",
    category: "WordPress",
    tags: ["WordPress", "WooCommerce", "Ecommerce", "Yoast SEO", "Saran Zafar"],
    thumb: UNSPLASH("1560066984-138dadb4c035"),
    year: 2024,
    role: "WordPress / WooCommerce Developer",
    liveUrl: "https://nadeemshair.com/",
    featured: false,
    gallery: GALLERY.haircare,
    long: `Nadeem's Hair is a direct-to-consumer haircare brand selling through a WooCommerce-powered storefront. The product range is built around real hair-routine needs, and the website had to make the brand feel as cared-for as the products themselves — clean photography, calm typography, and a checkout flow that does not get in its own way.

The store is structured for both first-time buyers and returning customers. A first-time visitor lands on a hero that explains who the brand is for, drops into category navigation that mirrors the way people actually shop for haircare, and sees product cards with the right balance of imagery, price and proof. A returning customer can get from the home page to checkout in two or three clicks without having to navigate around offers they have already seen.

On the engineering side, this was a full WooCommerce build: product schema, payment integration, order flow, shipping logic and post-purchase email touchpoints. SEO is configured per product and per category with Yoast, image delivery is tuned for fast mobile load times, and the whole site is set up so the client can add new products without breaking the storefront layout.

${WP_WORKFLOW}`,
  },

  {
    slug: "revlyticshealth",
    title: "RevlyticsHealth — Medical Billing & RCM Platform",
    description:
      "A healthcare-technology marketing site for a US medical billing and revenue-cycle management company serving solo practices to large hospital systems.",
    category: "WordPress",
    tags: ["WordPress", "Healthcare", "Medical Billing", "B2B", "Yoast SEO", "Saran Zafar"],
    thumb: UNSPLASH("1576091160399-112ba8d25d1f"),
    year: 2024,
    role: "WordPress Developer",
    liveUrl: "https://revlyticshealth.com/",
    featured: true,
    gallery: GALLERY.healthcare,
    long: `RevlyticsHealth is a US healthcare technology company offering cloud-based medical billing, coding, credentialing and revenue-cycle management. They serve everyone from solo physicians to multi-location hospital groups, and the website needed to talk credibly to all of them without sounding generic.

I structured the site around the three things a medical practice administrator actually wants to know in the first thirty seconds: do you understand my speciality, can you genuinely improve our reimbursements, and is my data safe with you. The home page answers all three before the first scroll. Service pages then go deep on RCM consulting, electronic claims processing, telemedicine, EMR integration, patient portals and HIPAA-compliant data handling — the full operational stack a healthcare buyer evaluates against.

The design language is clean and clinical without being cold, and the tone leans on the company's track record since 2014 rather than over-promising. Lead capture is built into every meaningful page, and Yoast SEO is configured around the queries practice managers actually type — "medical billing services", "revenue cycle management", "medical coding outsourcing" — so the site earns organic traffic instead of relying purely on paid acquisition.

${WP_WORKFLOW}`,
  },

  /* ─── Next.js ─── */
  {
    slug: "afromarket",
    title: "Afro Market — B2B Trade Marketplace",
    description:
      "A multilingual B2B marketplace built in Next.js connecting African producers with global buyers across 50+ countries.",
    category: "Next.js",
    tags: ["Next.js", "TypeScript", "Marketplace", "B2B", "i18n", "Saran Zafar"],
    thumb: UNSPLASH("1560179707-f14e90ef3623"),
    year: 2025,
    role: "Full-Stack Next.js Developer",
    liveUrl: "https://efgafromarket.ae/en",
    featured: true,
    gallery: GALLERY.marketplace,
    long: `Afro Market is a B2B trade marketplace operated under EFG Hub (Enterprise of the Future Generation) connecting African producers, farmers, exporters and artisans with retailers, importers, distributors and restaurants in more than fifty countries. The platform handles verified suppliers, product catalogues, quote requests, secure payments, export documentation and end-to-end logistics.

The front-end is a Next.js application built for two very different audiences sharing one codebase. Buyers need fast, trustworthy product discovery — clean category pages, supplier verification cues, RFQ flows. Suppliers need a different experience entirely — listing management, inquiry inboxes, order tracking. The site is structured so each audience gets a tailored journey while sharing the same design system and authentication layer.

Performance and internationalisation were the two biggest engineering priorities. The platform supports English and Arabic with full RTL handling. Image-heavy product pages are tuned with the Next.js image pipeline, route-level data fetching is cached aggressively, and the whole stack is wired to scale as new product categories and supplier countries come online. Companion mobile apps for buyers and suppliers extend the experience beyond the web.

This is the kind of project where the website is not a brochure — it is the actual product, and every interaction has to feel as solid as the trade transactions running through it.`,
  },

  {
    slug: "afromarket-admin",
    title: "Afro Market — Admin Dashboard",
    description:
      "An internal Next.js admin dashboard for managing suppliers, buyers, products, RFQs, orders and logistics across the Afro Market platform.",
    category: "Next.js",
    tags: ["Next.js", "TypeScript", "Dashboard", "Admin Panel", "Saran Zafar"],
    thumb: UNSPLASH("1551288049-bebda4e38f71"),
    year: 2025,
    role: "Full-Stack Next.js Developer",
    liveUrl: "https://dashboard.efgafromarket.ae/admin-login",
    featured: false,
    gallery: GALLERY.dashboard,
    long: `This is the operations dashboard that runs Afro Market behind the scenes. While the public marketplace handles the buyer and supplier experience, every approval, verification, dispute, escalation and logistics decision flows through this admin platform. It is built in Next.js with a strict role-based access model so different teams — onboarding, trade compliance, finance, support — see only the data and actions relevant to them.

The dashboard covers supplier onboarding and verification, product catalogue moderation, RFQ and quote management, order lifecycle tracking, payment and dispute resolution, and logistics coordination across multiple countries. Each module is built around real operator workflows rather than generic CRUD screens — what does a trade compliance officer actually need to see in the first three seconds when a flagged shipment arrives, and how do we make that decision a single click instead of three.

Engineering-wise, the focus was on data density without visual noise: clean tables with the right defaults, fast filtering, server-driven pagination, optimistic updates where they make sense and audit trails everywhere they matter. Authentication is hardened, every action is logged, and the dashboard is tuned to load even on a thin connection because operators in some regions do not have the bandwidth to wait.`,
  },

  /* ─── React ─── */
  {
    slug: "hisglory-ai",
    title: "HisGlory.ai — React Bug-Fixing & Stabilisation",
    description:
      "A React bug-fixing engagement on an AI-powered product, focused on stabilising the front-end, untangling state issues and shipping a reliable build.",
    category: "React",
    tags: ["React", "Bug Fixing", "Refactor", "AI Product", "Saran Zafar"],
    thumb: UNSPLASH("1517245386807-bb43f82c33c4"),
    year: 2025,
    role: "React Developer",
    liveUrl: "https://hisglory.ai/",
    featured: false,
    gallery: GALLERY.tech,
    long: `HisGlory.ai is an AI-powered product built on a React front-end. I came into this engagement after the initial team had shipped the first version — the product worked in spirit, but the front-end was carrying a number of state-management bugs, race conditions on async actions, broken edge cases in the UI and a handful of regressions that surfaced under real-user load.

The work was fundamentally diagnostic before it was constructive. I went through the codebase systematically, reproduced each reported bug locally, traced it to its actual root cause rather than its surface symptom, and fixed it in a way that did not silently introduce new failure modes elsewhere. Several of the bugs were classic React traps — stale closures over state, effects firing in the wrong order, key-mismatched lists triggering remounts — and the fixes were as much about restructuring the data flow as they were about patching individual lines.

Alongside the fixes, I tightened a few UX rough edges, hardened error handling on the network boundaries and left the codebase in better shape than I found it — clearer component boundaries, fewer implicit dependencies and a build that the team can extend without the same class of bugs reappearing. This is the kind of work that does not show up on a flashy portfolio screenshot, but it is the work that decides whether a product survives its first thousand users.`,
  },

  /* ─── Phase 2 additions ─── */
  {
    slug: "ad-transport-dubai",
    title: "AD Transport LLC FZ — Dubai Refrigerated Transport",
    description:
      "A WordPress website for a Dubai-based cold-chain logistics company providing refrigerated vehicles for temperature-sensitive cargo across the UAE.",
    category: "WordPress",
    tags: ["WordPress", "Logistics", "Cold Chain", "Dubai", "B2B", "Yoast SEO", "Saran Zafar"],
    thumb: UNSPLASH("1601584115197-04ecc0da31d7"),
    year: 2024,
    role: "WordPress Developer",
    featured: false,
    gallery: GALLERY.logistics,
    long: `AD Transport LLC FZ is a Dubai-based logistics company specialising in refrigerated and cooling vehicle transport across the UAE. They move temperature-sensitive cargo — fresh produce, frozen goods, dairy, pharmaceuticals and other cold-chain freight — for businesses that cannot afford a single break in the cold chain. The website needed to communicate operational reliability, fleet capability and UAE-wide coverage to logistics managers and procurement leads who evaluate carriers against very specific criteria.

I structured the site around the questions a cold-chain buyer actually asks in the first thirty seconds: what kind of vehicles do you operate, what temperature ranges do you maintain, how do you guarantee continuity from pickup to delivery, and are you licensed to move my type of cargo. The home page leads with the fleet and the service zones, then drops into clearly-defined service pages for refrigerated transport, frozen freight, chilled distribution and cross-emirate delivery. Trust signals — fleet imagery, free-zone licensing, service coverage maps — sit close to every call to action.

The visual language is clean and industrial without being cold. Strong photography of refrigerated trucks, simple service iconography, and pricing-on-request CTAs that match how UAE B2B logistics is actually transacted. Yoast SEO is configured around the queries logistics managers genuinely type — "refrigerated transport Dubai", "cold chain logistics UAE", "frozen cargo delivery" — so the site earns inbound enquiries instead of relying purely on referrals.

${WP_WORKFLOW}`,
  },

  {
    slug: "developer-portfolio-nextjs",
    title: "Developer Portfolio — Next.js, SEO-First Build",
    description:
      "A custom developer portfolio built in Next.js with SEO, performance and accessibility treated as first-class features rather than afterthoughts.",
    category: "Next.js",
    tags: ["Next.js", "TypeScript", "Portfolio", "SEO", "Performance", "App Router", "Saran Zafar"],
    thumb: UNSPLASH("1517180102446-f3ece451e9d8"),
    year: 2024,
    role: "Full-Stack Next.js Developer",
    featured: false,
    gallery: GALLERY.portfolio,
    long: `This is a developer portfolio I built in Next.js with the full set of modern Next.js capabilities engineered into the foundation rather than bolted on at the end. The brief was simple — a portfolio that loads instantly, ranks for the developer's name and skills, looks distinctive without being noisy, and stays easy to update as new projects ship.

Architecturally, the site is built on the Next.js App Router with route-level metadata, dynamic Open Graph images, an XML sitemap, robots configuration and JSON-LD structured data for the Person and Project schemas. Every page sets its own title, description, canonical URL and social card, so a link shared on LinkedIn or X looks deliberate instead of accidental. Core Web Vitals — LCP, CLS, INP — were tuned end-to-end: next/image with proper sizing and priority hints, font preloading with next/font, edge caching where it matters, and route segments that stream rather than block.

Beyond performance and SEO, the site is built to last. Project content is kept in a structured source so adding a new case study takes minutes, not hours. Theming is wired through CSS variables so a dark/light toggle is honest rather than cosmetic. Accessibility was treated as a constraint from day one — keyboard navigation, focus rings, semantic landmarks, reduced-motion handling — because a portfolio that fails an accessibility audit is a portfolio that quietly loses opportunities.

The result is a site that does the things a portfolio is actually supposed to do: load in under a second, get found on Google, hold a recruiter's attention for longer than three seconds, and make the next project trivially easy to add.`,
  },

  {
    slug: "khanakhazana",
    title: "KhanaKhazana — Django Restaurant Ordering Platform",
    description:
      "A Django-based restaurant ordering platform with menu browsing, cart, checkout and order management — built end-to-end on the Python stack.",
    category: "Django",
    tags: ["Django", "Python", "PostgreSQL", "Restaurant", "Ecommerce", "Full Stack", "Saran Zafar"],
    thumb: UNSPLASH("1555396273-367ea4eb4db5"),
    year: 2023,
    role: "Django Developer",
    featured: false,
    gallery: GALLERY.restaurant,
    long: `KhanaKhazana is a Django-based restaurant ordering platform I built to take a single restaurant from a printed menu to a working online ordering experience. Customers can browse the full menu by category, see dish details and pricing, add items to a cart, place an order and follow its status. On the operator side, the restaurant can manage the menu, see incoming orders and update their status as they move through the kitchen.

This was originally a test project for me — a deliberate choice to ship a real, end-to-end Django application rather than a tutorial-shaped toy. That meant taking the boring parts seriously: a clean models layer for menu items, categories, orders and order lines; Django auth for customers and staff; form validation and CSRF protection on every write; server-rendered templates with a sensible component pattern; and PostgreSQL behind it all so the schema reflected real data rather than SQLite shortcuts.

The front-end is built on Django templates with progressive enhancement rather than a heavy SPA. Menu browsing, cart updates and the checkout flow all work without JavaScript, then layer on small interactive touches where they genuinely improve the experience. The admin side leans on Django's built-in admin where it makes sense and adds custom views for the workflows the default admin cannot express cleanly.

It is a focused project with a clear scope: prove that I can take a real-world domain — a restaurant — and turn it into a working ordering system on the Django stack from data model to deployed application.`,
  },
];

/* ─── Slug-safe and main ─── */

async function main() {
  console.log("[seed-real] target:", URL_);

  // Wipe existing projects + project categories first.
  console.log("[seed-real] wiping projects + project categories…");
  {
    const { error } = await sb
      .from("projects")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
  }
  {
    const { error } = await sb
      .from("categories")
      .delete()
      .eq("kind", "project");
    if (error) throw error;
  }

  // Insert categories.
  console.log(`[seed-real] inserting ${CATEGORIES.length} categories…`);
  const { data: insertedCats, error: catErr } = await sb
    .from("categories")
    .insert(
      CATEGORIES.map((c) => ({ ...c, kind: "project" as const }))
    )
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
    repo_url: null,
    featured: p.featured,
    status: "published" as const,
    published_at: now,
    created_at: now,
    updated_at: now,
  }));

  console.log(`[seed-real] inserting ${rows.length} projects…`);
  const { error: pErr } = await sb.from("projects").insert(rows);
  if (pErr) throw pErr;

  const head = { count: "exact" as const, head: true };
  const [{ count: pc }, { count: cc }] = await Promise.all([
    sb.from("projects").select("id", head),
    sb.from("categories").select("id", head).eq("kind", "project"),
  ]);
  console.log(`[seed-real] ✓ projects=${pc}  categories=${cc}`);
}

main().catch((e) => {
  console.error("[seed-real] FAILED:", e);
  process.exit(1);
});
