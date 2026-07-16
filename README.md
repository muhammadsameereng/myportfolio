# Muhammad Sameer — Portfolio

Personal portfolio of **Muhammad Sameer**, a full-stack software engineer from Kotli, Azad Kashmir — building React / Next.js frontends, Node.js & NestJS APIs, and React Native & Flutter apps.

**🌐 Live:** [msameer.vercel.app](https://msameer.vercel.app)

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white">
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white">
</p>

---

## ✨ Highlights

- **Animated, theme-aware background** — a layered mountain parallax that reacts to scroll, with a splashing **starfield at night** and a **sun, clouds & birds by day** (GPU-only, respects `prefers-reduced-motion`).
- **3D tilt portrait** that follows the cursor, with an idle float and glare.
- **Experience page** with pure-CSS animated device mockups (streaming-code laptop, live-scrolling phone, front-end ↔ API ↔ DB data flow).
- **AI "Caret" chatbot** (Google Gemini) grounded in a curated knowledge base — answers questions and can email on a visitor's behalf.
- **Content backend** — Supabase-powered projects & blog, editable from a protected `/admin` (magic-link auth + RLS), with a static fallback so the site ships populated.
- **SEO-first** — per-page metadata, canonicals, Open Graph, sitemap, robots, and JSON-LD (Person, Breadcrumbs, Article, CreativeWork).
- **Fast** — Next 16 App Router, `next/image` optimization, inlined CSS, edge caching, and strong Core Web Vitals.

## 🧰 Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Framer Motion, Geist + Space Grotesk |
| Backend | Supabase (Postgres, Auth, Storage, RLS) |
| AI | Google Gemini (chatbot + blog generation) |
| Email / Bots | Resend, Cloudflare Turnstile |
| Hosting | Vercel (Analytics + Speed Insights) |

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see below)
cp .env.example .env.local   # then fill in the values

# 3. Run the dev server
npm run dev                  # http://localhost:3000
```

The public site works out of the box (static fallback content). Supabase, Gemini, Resend, and Turnstile are optional and unlock the admin, chatbot, contact email, and bot-protection respectively.

## 🔐 Environment Variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin / seed scripts |
| `ADMIN_EMAILS` | Comma-separated allow-list for `/admin` |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (production) |
| `RESEND_API_KEY` / `CONTACT_TO_EMAIL` | Contact-form delivery |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile |
| `GEMINI_API_KEY` | AI chatbot + blog pipeline |

> `.env.local` is git-ignored — never commit real keys. On Vercel, add these under **Settings → Environment Variables**.

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint with ESLint |

## 🗂️ Structure

```
app/
├─ (pages)         home, about, experience, projects, blog, contact, admin
├─ components/     UI, background/animation, agent (chatbot), admin
├─ lib/            data layers, supabase, agent, email
supabase/          schema.sql + config
scripts/           content seed scripts
```

## 🚢 Deploy

Deploys on **Vercel** — import the repo, add the environment variables, and ship. To enable content editing, run `supabase/schema.sql` in the Supabase SQL Editor, then sign in at `/admin`.

## 📫 Contact

- **Email:** msameerdevelops@gmail.com
- **GitHub:** [@muhammadsameereng](https://github.com/muhammadsameereng)
- **LinkedIn:** [muhammad-sameer](https://www.linkedin.com/in/muhammad-sameer)

---

<sub>Built with Next.js. Designed and developed by Muhammad Sameer.</sub>
