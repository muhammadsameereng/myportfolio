# saranzafar.com — Project Brief

> Living document. Updated continuously as the project evolves.
> Last updated: 2026-04-20 (rev 2)

> ⚠ **DESIGN NOTICE — read before using §4 / §5 / §10.**
> The "lines, not boxes / sharp edges / mono / max-w-6xl / shell prompts"
> direction documented below was **superseded** during May 2026. The shipped
> site now uses rounded-2xl cards, pill CTAs, glass nav, soft shadows,
> Geist Sans body, blue focus rings, and `max-w-5xl` containers.
>
> **Do not design from this document.** The live components are the spec.
> See the "design source of truth" block in `AGENTS.md` and read
> `app/components/Navbar.tsx`, `Footer.tsx`, `ContactPageContent.tsx`,
> `HomeProjects.tsx`, and `SectionHead.tsx` before touching UI.
>
> Sections that remain valid: §1 (Who & Why), §2 (Soul — *principles only,
> not visual rules*), §3 (Tech Stack), §6 (Workflow), §7 (Content), §11
> (Testimonials data). The Decisions Log (§8) and Changelog (§10) are kept
> for history, not as current spec.

---

## 1. Who & Why

**Owner:** Saran Zafar — Software Engineer & Full Stack Developer, based in Kashmir.
**Focus:** Backend-heavy (NestJS, TypeScript, APIs, service-oriented architecture), with full-stack reach into Next.js/React and React Native. 2+ years, 25+ clients.

**The site:** `saranzafar.com` — a personal portfolio that acts as Saran's presence on the web. Not a CV dump. A space that introduces him to strangers and leaves an impression.

## 2. Soul & Guiding Principles

The website must **talk to the visitor**. When someone lands, they should feel a point of view — not just see sections. Three principles:

1. **Creativity** — small, memorable moments (the living terminal, timeline, numbered sections). The visitor should notice *something* they haven't seen before.
2. **Simplicity** — one idea per section. Thin rails, mono type, sharp edges. No visual noise competing with the message.
3. **Depth of thought** — every element justifies its existence. If a section could be removed without loss, it should be.

**Voice:** first person, direct address to the visitor ("you"), confident but not boastful. Terminal/engineer aesthetic — monospaced accents, editor-like chrome.

## 3. Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.2.4 (App Router, React 19) |
| Styling | Tailwind v4 (CSS-first with `@theme inline`) |
| Motion | framer-motion 12 |
| Icons | lucide-react |
| Content (planned) | Supabase — dynamic projects, services, blogs |
| Theme | Light + Dark, class-based, pre-hydration script |
| Language | TypeScript |

> **Note on Next.js:** This version has breaking changes from pre-2026 training data. Consult `node_modules/next/dist/docs/` before writing Next-specific code (from `AGENTS.md`).

## 4. Design System

### Layout primitives
- Container: `max-w-6xl` with horizontal padding `px-6 sm:px-8` — **applied uniformly** to Navbar, Hero, SectionDivider, Projects. The left/right edges must never shift between sections. Non-negotiable.
- **Signature rails:** two thin vertical `bg-border/30-40` lines at container edges, repeated every section. This is the page's spine.
- **Section labels:** a short horizontal hairline + small uppercase mono slug. Example: `—— /work`. No bordered pills. No numbering.
- **Separation, not enclosure:** data is separated by **lines** (top/bottom hairlines, small vertical `h-3 w-px` dividers between inline items). **No enclosing frames, no cell grids, no rounded corners.** Lines, not boxes.
- **Section vertical rhythm:** `py-24` on standard sections; tighter headings (`mb-10`) and body rhythm. No long vertical voids.

### Color
Neutral zinc grayscale. No brand hue. The only color on the page is the three macOS-style dots on the terminal. Light theme `#fafafa`/`#0a0a0a`, dark theme `#09090b`/`#fafafa`. Full tokens in `app/globals.css`.

### Typography
- Sans: Geist (body, headings)
- Mono: Geist Mono (labels, captions, terminal, tech names)
- Large display name, small mono accents — strong contrast of scale.

### Motion
- Intro stagger on Hero (0.2s → 1.8s cascade)
- Scroll-triggered reveals elsewhere via `useInView`
- Micro-interactions only where they reward attention. No motion-for-motion's-sake.

### Buttons & edges
- Sharp edges (no rounded cards). Dashed borders for secondary.
- Hover: opacity/color shift, never translate/scale.

## 5. Home Page — Section Plan

Executed as a narrative. Each section answers the question raised by the previous.

| # | Section | Status | Intent |
| --- | --- | --- | --- |
| # | Section | Status | Intent |
| --- | --- | --- | --- |
| 01 | **Hero** | Done | Introduce — name, role, terminal personality, CTAs |
| 02 | **Selected Work** *(Projects)* | **Current focus — rebuilt as "short stories"** | Prove — 3 projects with room to breathe. Each: meta (year · role · domain), bold title, labelled "the problem" + "what shipped" paragraphs, stack row, "read the case" link. Closes with "the full archive" link. |
| — | About / Writing / Testimonials / Closing CTA | **Removed** | Old home sections scrapped 2026-04-21 — did not match Saran's vision. These may return later, redesigned from scratch, once Projects is finalized. |

**Deliberately omitted from home:**
- **Services** — Saran is focusing on presence, not selling services here.
- **Standalone Skills/icon grid** — already covered inside About. A separate section would be generic filler.
- **Full Contact form on home** — Contact lives on its own page `/contact`. Home closes with a CTA that links to it.

## 6. Workflow

The working agreement between Saran and the assistant:

1. **Design** — propose, iterate on look & feel for a section
2. **Confirmation** — Saran reviews and approves
3. **Next move** — implement / move on

Currently: finishing Hero polish, transitioning into Projects design.

## 7. Dynamic Content (Supabase — planned)

To be wired after home page layout is finalized. Three content types:

- **Projects** — title, slug, tags, summary, cover, role, year, links, body
- **Services** — title, tagline, description, deliverables, pricing tier
- **Blog posts** — title, slug, excerpt, cover, tags, publishedAt, body (MDX or markdown)

Schema + auth strategy to be designed later.

## 8. Decisions Log

Resolved so far:
- **Services** — dropped from home (2026-04-20).
- **Contact** — dedicated page at `/contact`, not a home section (2026-04-20).
- **Testimonials** — 7 real quotes imported from current saranzafar.com WordPress site (2026-04-20). Source of truth is §11 below until Supabase is wired.
- **Hero numbering** — add `01` label for consistency with About's `02` (2026-04-20).

Still open:
- Ordering of Testimonials vs. Writing — testimonials could close the proof arc right after Work; Writing could follow as the quieter voice. Current plan: Work → Writing → Testimonials → Closing CTA. Revisit if it feels off in layout.
- Closing CTA copy — to be drafted during Contact-page design.

## 9. Current File Map

```
app/
├── layout.tsx                    # Theme provider + pre-hydration script
├── page.tsx                      # Navbar + Hero + About + Projects + Writing + Testimonials + ClosingCTA
├── globals.css                   # Tailwind v4 theme tokens, grain overlay
└── components/
    ├── Navbar.tsx                # Fixed, scroll-spy (hash-aware), mobile drawer, theme toggle
    ├── HeroSection.tsx           # 01 — Identity + terminal, rails, scroll cue
    ├── HeroBackground.tsx        # Background visual
    ├── HeroTerminal.tsx          # 4-scene looping terminal animation
    ├── AboutSection.tsx          # 02 — Timeline + tech stack + stats
    ├── SkillsSection.tsx         # Skill box grid (data from saranzafar.com, Supabase TODO)
    ├── ProjectsSection.tsx       # Projects (seed data, Supabase TODO)
    ├── WritingSection.tsx        # 04 — Post list (seed data, Supabase TODO)
    ├── TestimonialsSection.tsx   # 05 — Rotating pull-quote (6 real quotes)
    ├── ClosingCTA.tsx            # 06 — Terminal-prompt CTA to /contact
    ├── SectionDivider.tsx        # Asymmetric hairline divider, shell-command label (rails pass through)
    ├── ScrollToTop.tsx           # "The thread" — progress line + cursor + `cd ~` label
    ├── ThemeProvider.tsx
    └── ThemeToggle.tsx
```

## 10. Changelog

- **2026-04-21 (rev 22)** — Four design-critique fixes applied in one pass. **(1)** Skills restructured as a shared-hairline grid — same structural language as Projects. `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` with `border-t border-l` on the container and `border-r border-b` on each cell. Each cell now `h-24` with icon stacked above the skill name. **(2)** Skills gets a 12th `& more` tile (muted uppercase mono) — makes the grid land evenly on every breakpoint (12 = 2×6 = 3×4 = 4×3). **(3)** Whispered sublines removed from both Skills and Projects headings — the period-punctuated titles carry the confidence alone. **(4)** Project card hover simplified to one primary signal (dashed border) + one small secondary (arrow translate). Removed the tick widening, category hairline extend, category color change, slash color change, footer hairline extend, footer text color change. Five simultaneous motions → one confident change + one gentle cue.
- **2026-04-21 (rev 21)** — Skill chip borders get their own fade-in. Previously the solid border appeared together with the chip's opacity/y reveal — instant. Now the border is a separate `<motion.span>` absolute overlay that opacity-animates from 0 → 1 with a longer duration (`0.6s`) and a small trailing delay relative to each chip (`0.35s + 0.04s × index`). Content appears first, border draws in after — a subtle sequenced reveal.
- **2026-04-21 (rev 20)** — Skills chips now carry inlined SimpleIcons SVGs (14px, `fill="currentColor"`, monochrome, theme-aware). 11 icons total: typescript, nodedotjs, nestjs, nextdotjs, react (used for React.js + React Native), supabase, firebase, docker, rabbitmq, github. Zero dependencies — raw paths stored in a local `icons` map. On hover: icon brightens from `foreground/80` → `foreground`, dashed border reveals. Also: divider prompt glyph changed `_>` → `$` (more universally readable as "shell prompt"). Added a second `SectionDivider` between Skills and Projects. Page flow: Hero → `$ cd /skills` → Skills → `$ cd /work` → Projects. Hero's internal terminal still uses `_>` (its own visual signature, not a page divider).
- **2026-04-21 (rev 19)** — Skills switched from a stretched 4-col grid to compact centered chips. Layout: `flex flex-wrap justify-center gap-3`. Each box: tight padding `px-5 py-2.5`, single `border-border/70`, mono skill name, dashed-border hover. Removed the top-left entry-tick (looked disproportionate on small chips). Boxes now sit as a wrapped centered cluster rather than a heavy grid.
- **2026-04-21 (rev 18)** — Added `SkillsSection` between the divider and Projects. 11 skills fetched verbatim from saranzafar.com (TypeScript, Node.js, Nest.js, Next.js, React.js, React Native, Supabase, Firebase, Docker, RabbitMQ, Git/GitHub), reordered core → framework → BaaS → infra. Layout: heading (`Skills.`) + whispered subline ("The things I reach for without thinking about them. Years of typing, breaking, and fixing — the reflexes of the craft."), then a grid of individual bordered boxes — 2 cols on mobile, 3 on tablet, 4 on desktop. Each box: fixed height `h-28`, single `border-border/70`, mono skill name centered, 3px foreground entry-tick at top-left that widens from 24 → 40px on hover, dashed-border hover overlay — same hover vocabulary as project cards. Page order is now: Hero → divider → Skills → Projects, so the `cd /work` divider leads into the whole "work" territory of skills + projects.
- **2026-04-21 (rev 17)** — Divider restored with command text: `_> cd /work` as static mono label on the left (prompt foreground, command foreground/75), followed by the same gradient signal-line fading from foreground → border across the width. Removed the closing right tick. Component takes an optional `command` prop (defaults to `cd /work`).
- **2026-04-21 (rev 16)** — Divider gets character. The hairline is now a **horizontal gradient** — foreground at 0–6%, fading through foreground→border between 6–26%, then quiet border from 26–100%. Reads as a "signal line" — strong at the source (next to the `_>` prompt), dissipating as it crosses the page. Still a single line, still static, still one `_>` on the left and one small tick on the right as foreground bookends. CSS linear-gradient, theme-aware via `var(--foreground)` / `var(--border)`.
- **2026-04-21 (rev 15)** — Divider visual fix. Previous version (heavy 16px block next to a 1px hairline) read as broken. Replaced with a properly balanced three-piece layout: `_>` prompt on the left (foreground), a continuous thin hairline through the middle (border color), and a small 8px foreground vertical tick on the right as a "closer" bookend. Two foreground anchors framing a single line — balanced, intentional, no weight mismatch.
- **2026-04-21 (rev 14)** — Divider stripped to a static element. Dropped framer-motion entirely from `SectionDivider`, no reveal animation, no blinking cursor. It is now three static pieces on one row: `_>` prompt, a small foreground block (the idle cursor), and a hairline to the right rail. Component is also no longer `"use client"` — pure server-rendered markup. Simplicity over cleverness.
- **2026-04-21 (rev 13)** — **Voice de-jargoned for non-technical visitors.** Terminal *aesthetic* stays; terminal *vocabulary* for end-users does not. Removed: divider's `cd /work` command + its typing animation (divider is now just `_>` + blinking cursor + hairline — "something's listening"); Projects' `_> ls ~/work · 03 ENTRIES` header; per-card `cat README`; archive link's `ls ~/work --all`. Replaced with: plain-English `more` on each card (uppercase-tracked), `see all work` on the archive link. **New rule:** `_>` is OK as a signature visual motif; typed shell commands aimed at the visitor are not. Copy visible to visitors must read naturally in one second.
- **2026-04-21 (rev 12)** — Divider padding reduced to `py-1.5`. Projects section reworked for depth: (a) new shell-output header `_> ls ~/work ─── 03 entries` sits above the heading — the natural follow-up to the divider's `cd /work`, so the two sections now read as one continuous shell session. (b) Category labels now use filesystem grammar: `saas/`, `realtime/`, `healthcare/` (trailing slash in muted border color, brightens on hover). (c) Each card now closes with an **action footer** separated by its own hairline: `── cat README →`, using the shell verb for "open this." Muted by default; on hover the leading hairline extends, the top-tick widens from 8 → 14, and the arrow translates right — three subtle motions, one intent. (d) Title bumped to `text-2xl` with tightened leading for more weight. (e) Top padding cut from `py-24` to `pt-10 pb-24` so the divider leads straight into the section. (f) Archive link text changed to `ls ~/work --all` — shell flag grammar.
- **2026-04-21 (rev 11)** — Divider redesigned as a live shell line. `_>` prompt (foreground, mono) + typewriter command `cd /work` (foreground/75) + blinking block cursor at the end + hairline that extends to the right rail *after* the command finishes typing. Ties the divider back to the Hero terminal's signature `_>` prompt — one voice across the page. Padding reduced to `py-3` per feedback — the divider is now a tight single line of shell between the two sections.
- **2026-04-21 (rev 10)** — Real alignment fix. Root cause: Hero/Navbar put `px-6 sm:px-8` on the inner `max-w-6xl` container, so text starts 24/32px *inside* the max-w edge — the same place the rails sit. Projects/Divider had the padding on their outer wrapper but **nothing** on the inner content box, so content was flush to the max-w-6xl edge — 24/32px left of the rail. Fixed by moving the padding to match Hero's pattern: outer wrapper now just handles vertical padding, inner content box has `px-6 sm:px-8`. Navbar logo, Hero greeting, divider label, and Projects heading now share a single vertical axis — at every breakpoint. Also: **hover on a project card now reveals a dashed foreground-tinted border** — a line appearing in the card's own language. Removed the prior `bg-card/30` tint since the dashed border is the louder, cleaner signal.
- **2026-04-21 (rev 9)** — **Alignment lock.** Unified container width to `max-w-6xl` across every currently-rendered part: Navbar (nav + mobile drawer), Hero (rails + content), SectionDivider, Projects. Padding stays `px-6 sm:px-8`. ScrollToTop fixed at `right-6 sm:right-8` naturally sits on the right rail. The left edge of the navbar logo now aligns exactly with the left edge of every section's content and rail. Marked as a non-negotiable rule in §4 of this doc.
- **2026-04-21 (rev 8)** — Four fixes from screenshot review: (1) `SectionDivider` label moved to the left edge; now reads as `cd /work | ─────────────────────` (label → foreground tick → hairline filling the rest). (2) Divider padding tightened from `py-16` to `py-6` — no dead space around it. (3) Removed the bouncing scroll arrow + its vertical line from Hero's footer — the divider does that job now. (4) Removed the duplicate `/work` label from Projects section header — the divider (`cd /work`) already announces the section; the Projects heading now leads straight with `Projects.` + whispered subline.
- **2026-04-21 (rev 7)** — Added `SectionDivider` between Hero and Projects. Asymmetric horizontal hairline (30% left / label / flex-1 right) split by a shell-command label (`cd /work`) flanked by two short foreground ticks. Page's vertical rails pass through the divider so the spine stays continuous. Animation: left segment reveals from origin-left, then label fades, then right segment extends. Establishes a **shell vocabulary** across the site: `cd /work` (divider / transition) → `/work` (section header / destination) → `cd ~` (ScrollToTop / return home). The whole page now speaks one language.
- **2026-04-21 (rev 6)** — Projects simplified to 4 content fields only: `category`, `title`, `description`, `tags`. Dropped year, role, domain, and the per-project "read the case" link — the entire column is now the link. New voice: heading is `Projects.` (period for weight); paired with a whispered subline ("Each one began as a problem someone brought to me. These are the ones I still think about long after the invoice was paid.") The category uses the same line+mono pattern as the section label (`─── saas`) — the page now speaks one consistent visual language for every labelled thing. Titles end with a period to read as statements, not headlines. On hover: column gets a subtle `bg-card/30` tint, the category's leading hairline extends and goes foreground.
- **2026-04-21 (rev 5)** — Projects reshaped to a **single row of 3 columns** (stacked on mobile). Separated by internal vertical hairlines; top and bottom of the row are closed by horizontal hairlines. Each column has a small 3px foreground tick at the top edge as the "you're reading this" marker. Container widened to `max-w-6xl` to give each column real room. Heading moved to a two-column flex (title left, description right, aligned at baseline) to avoid a tall header above a wide row. Descriptions tightened to a single focused paragraph per project (dropped the `problem` / `what shipped` split — wasn't going to fit three-up).
- **2026-04-21 (rev 4)** — Honest reset. Saran confirmed the post-Hero sections (About, Writing, Testimonials, Closing CTA) did **not** match his vision. Scrapped all of them from `page.tsx` (files kept in `components/` for reference but no longer rendered). Rebuilt **Projects** as the new second section in a "short stories" format: 3 projects, each with generous vertical space, meta row (year · role · domain), bold 2-line title, labelled `the problem` / `what shipped` paragraphs in Saran's voice (seed content — needs real data), stack row, and `read the case →` link. Small foreground hairline tick above each story separates them. Closes with a full-width `the full archive` link. Navbar trimmed to `Work` + `Contact`.
- **2026-04-21 (rev 3)** — Added `ScrollToTop` component — **"the thread"**. Fixed bottom-right vertical hairline that mirrors the page rails. Fills from top as the visitor scrolls (the thread they've pulled through the story). A blinking 5px cursor sits at the fill boundary — "you are here", echoing the Hero terminal cursor. Small ticks mark start (foreground) and end (border). Label `cd ~` — shell command for "return home", tying the control to Saran's Arch/terminal identity. Appears after 50% of viewport scrolled; click smooth-scrolls to top and the line drains back.
- **2026-04-21 (rev 2)** — Design language corrected: **lines, not grids.** Stripped all bordered label pills and enclosing frames. Section labels now: short hairline + mono slug (`—— /work`). Lists: only top-border hairlines between rows. About: removed the stats block (duplicated Hero's mobile strip) and the framed tech-stack grid — tech stack is now a single inline row separated by thin vertical dividers. Testimonials: removed the bordered frame + header bar (`auto/paused`, `01/06`); quote sits between two hairlines, counter moved to the nav row. Closing CTA: removed the bordered block, the terminal prompt bar, and the framed footer strip — just headline, body, CTAs, and a one-line hairline footer. Section padding tightened from `py-32` to `py-24`.
- **2026-04-21** — Removed all numbered section labels (`01`, `02`, …). New signature: bordered two-cell label pills (`[/slug][ Name ]`) and full-frame enclosure for every data set. About tech stack → bordered grid of cells; stats → 3-column framed grid. Projects → full border with header row (Year / Project / Role) and internal dividers. Writing → same table-with-frame treatment (Date / Essay / Read). Testimonials → bordered quote block with header bar (quote 01/06, auto/paused state) and two-cell attribution footer. Closing CTA → framed prompt with terminal bar, headline cell, and two-cell action bar (primary CTA + mail), plus a framed footer strip. Neutral-only: dropped the emerald "available" dot.
- **2026-04-20 (rev 3)** — Full home page implemented: Hero gets `01` label; new ProjectsSection (editorial list), WritingSection (post list), TestimonialsSection (rotating quote with 6 real testimonials — Abdul Wahab dropped as near-dup of Ayaz), ClosingCTA (terminal prompt + /contact link). Navbar updated: Services removed, Blog→Writing, Testimonials added, Contact now points to `/contact` page. Scroll-spy made hash-aware.
- **2026-04-20 (rev 2)** — Decisions locked: Services dropped, Contact moved to `/contact` page, Hero to get `01` label, testimonials imported from live site (§11). Section plan in §5 updated.
- **2026-04-20** — Document created. Hero + About implemented. Home-page section plan agreed in principle.

## 11. Testimonials (imported from saranzafar.com — 2026-04-20)

Seven real quotes fetched from the live WordPress site. These will be committed to the repo as seed content and eventually migrated into Supabase. Avatars sit on the live site (`/wp-content/uploads/2026/01/...`) — most are placeholders (`fake-dp-60x60.jpg`); only Ayaz Naseeb has a real photo (`ayaz-naseeb-saranzafar-60x60.png`). Treat avatars as optional for the new design — can fall back to initials if not provided.

| # | Name | Role | Avatar |
| --- | --- | --- | --- |
| 1 | Ayaz Naseeb | Software Engineer | real |
| 2 | Abdul Wahab | Software Engineer | placeholder |
| 3 | Usman Arif | Full Stack Developer | placeholder |
| 4 | Khawar Mehfooz | Software Engineer | placeholder |
| 5 | Dr. Imran Kiani | Skin Specialist | placeholder |
| 6 | M Ifraheem | Software Engineer | placeholder |
| 7 | Azkaar | CEO, NetzingTechnologies | placeholder |

### Quotes (verbatim)

**1. Ayaz Naseeb — Software Engineer**
> "Saran delivered a high-quality WordPress website that looks great and works flawlessly. He's professional, responsive, and truly cares about his work. Highly recommended."

**2. Abdul Wahab — Software Engineer**
> "Saran delivered a high-quality website that looks great and works flawlessly. He's professional, responsive, and truly cares about his work. Highly recommended."

**3. Usman Arif — Full Stack Developer**
> "Saran built my portfolio with a clear understanding of structure, performance, and presentation. The final result was clean, professional, and aligned perfectly with my personal brand."

**4. Khawar Mehfooz — Software Engineer**
> "Saran guided me through hosting selection and setup with complete clarity. His recommendation helped me save costs while getting a reliable and secure hosting solution."

**5. Dr. Imran Kiani — Skin Specialist**
> "Saran developed a desktop system that streamlined our clinic operations. His technical understanding and attention to real-world workflows made a noticeable difference."

**6. M Ifraheem — Software Engineer**
> "Saran is someone you can rely on for building a solid website. He understood our needs quickly and delivered a fast, clean, and well-organized solution."

**7. Azkaar — CEO, NetzingTechnologies**
> "Working with Saran on our Android application was a great experience. He delivered a stable, well-structured app and handled complex requirements with clarity and professionalism."

**Note for design/curation:** Testimonials 1 and 2 are near-duplicates (almost identical wording). Saran should decide whether to keep both, pick one, or ask Abdul Wahab for a fresher quote before the section ships.
