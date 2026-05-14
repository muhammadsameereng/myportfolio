<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:design-source-of-truth -->
# Design rules: read the live UI, not the spec

**The shipped components are the spec.** `docs/PROJECT.md` describes an older terminal/sharp-edge direction that the site has since moved past — do not use it as a design source. Anything in PROJECT.md that conflicts with the live components is stale.

Before designing or modifying any UI, read these reference components first and match their vocabulary:

| Reference | What it teaches |
| --- | --- |
| `app/components/Navbar.tsx` | Glass treatment (`backdrop-blur-xl backdrop-saturate-150`), pill nav, soft scrolled state, `bg-card/60` icon buttons, mobile drawer pattern. |
| `app/components/Footer.tsx` | Hairline section dividers, muted micro-copy, social icon row. |
| `app/components/ContactPageContent.tsx` | The canonical card form: `rounded-2xl border border-border bg-card p-6 sm:p-7`, blue focus ring on inputs, primary pill CTA with `ArrowUpRight`, `rounded-xl` icon chips, status dot pattern. |
| `app/components/HomeProjects.tsx` | `rounded-2xl` thumbnails, hover scale-up, full-bleed pill "View all" CTA. |
| `app/components/SectionHead.tsx` | Section heading + horizontal hairline pattern. |

## The vocabulary, in one screen

**Cards & containers** — `rounded-2xl border border-border bg-card`, padding `p-6 sm:p-7`. Nested cards use `bg-card/70` or `bg-background/95` with `border-border/60`.

**Inputs** — `h-11 rounded-xl border border-border bg-background px-3.5 text-[14px]`, focus ring is blue: `focus:border-blue-400/70 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]`.

**Primary button** — pill: `h-10 rounded-full bg-foreground px-5 text-[13px] font-medium text-background hover:scale-[1.02] hover:opacity-95`. Trailing icon is `ArrowUpRight` from lucide, with `group-hover:translate-x-0.5 group-hover:-translate-y-0.5`.

**Secondary button** — pill: `h-9 rounded-full border border-border bg-background px-3.5 text-[12.5px] font-medium hover:border-foreground/40 hover:bg-card`.

**Icon chip** — `h-9 w-9 rounded-xl border border-border bg-card` (or `rounded-full` for circular).

**Tiny labels** — `text-[11px] uppercase tracking-[0.18em] text-muted-foreground` (sometimes `[10.5px]` / `[0.22em]`).

**Body text** — `text-[14px]` or `text-[13.5px] leading-relaxed text-foreground/85`. Headings: `text-[16px]/[18px]/[26px] font-semibold tracking-tight`.

**Glass surfaces** (overlays, drawers, scrolled nav) — `bg-background/95 backdrop-blur-xl backdrop-saturate-150 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.18)]`.

**Status dot** (online/available) — `relative flex h-2 w-2` with `animate-ping bg-emerald-400/70` overlay + solid `bg-emerald-500` core.

**Motion** — `framer-motion` with `transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}`. The `fadeUp` helper in `ContactPageContent.tsx` is the standard reveal.

**Container** — `mx-auto max-w-5xl px-6` for page bodies (note: not `max-w-6xl`; PROJECT.md is wrong on this).

**Typography** — Geist Sans for body and headings, Geist Mono only for tiny micro-labels. Do **not** default to mono prose; the terminal aesthetic in PROJECT.md no longer reflects the live site.

**Color** — neutral zinc + a single accent: blue for focus rings, emerald for status, rose for errors, amber rarely. Backgrounds use the CSS tokens from `app/globals.css` (`--background`, `--foreground`, `--card`, `--border`, `--muted-foreground`).

## Anti-patterns (do not do these)

- **Sharp 1px borders with no rounded corners** — that was the old direction.
- **Mono-everything** — mono is for tiny labels, not body copy or buttons.
- **`_>` shell-prompt prefixes** in user-facing labels — removed from the live site (kept only inside the Hero terminal).
- **`max-w-6xl` containers** — current pages are `max-w-5xl`.
- **Numbered section badges** (`01`, `02`) — the site uses `SectionHead` (title + hairline) instead.
- **Brand color hues for emphasis** — keep the palette neutral; lean on size, weight, and the established accent roles above.
<!-- END:design-source-of-truth -->
