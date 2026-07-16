"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookMarked,
  CalendarClock,
  Code2,
  Lock,
  type LucideIcon,
} from "lucide-react";
import GithubHeatmap from "./GithubHeatmap";

function GithubMark({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const USERNAME = "muhammadsameereng";

// GitHub is private — most work lives in private client/company repos. So
// instead of live widgets (which can't read a private profile), the numbers
// below are stated directly. Edit them as they grow.
type Metric = { icon: LucideIcon; value: string; label: string };
const METRICS: Metric[] = [
  { icon: BookMarked, value: "100+", label: "Repositories" },
  { icon: CalendarClock, value: "3+ yrs", label: "Active on GitHub" },
  { icon: Code2, value: "15+", label: "Technologies" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function GithubActivity() {
  return (
    <motion.div
      {...fadeUp(0)}
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <GithubMark size={15} />
          </span>
          <div>
            <p className="text-[13px] font-semibold tracking-tight text-foreground">
              On GitHub
            </p>
            <p className="text-[11.5px] text-muted-foreground">{`@${USERNAME}`}</p>
          </div>
        </div>
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background px-4 text-[12.5px] font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-card"
        >
          Visit profile
          <ArrowUpRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>

      <div className="p-5 sm:p-6">
        {/* Private note */}
        <div className="flex items-start gap-3 rounded-xl border border-accent/25 bg-[rgb(var(--bg-teal)/0.06)] p-4">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Lock size={15} strokeWidth={1.9} />
          </span>
          <div>
            <p className="text-[13.5px] font-semibold text-foreground">
              My GitHub is private
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              Most of my work lives in private client and company repositories.
              The shape of it is below — and I&apos;m always happy to walk
              through code, architecture, or a specific project on request.
            </p>
          </div>
        </div>

        {/* Stated metrics */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {METRICS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-background/50 p-4 text-center transition-colors hover:border-accent/40 sm:text-left"
            >
              <span className="inline-flex items-center gap-1.5 text-accent">
                <Icon size={14} strokeWidth={1.9} />
              </span>
              <p className="mt-2 bg-gradient-to-br from-accent to-accent-warm bg-clip-text text-[24px] font-bold leading-none tabular-nums text-transparent sm:text-[26px]">
                {value}
              </p>
              <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Contribution graph — reflects public + private contributions
            (when "include private contributions" is enabled on the profile),
            without exposing any private repo details. Falls back gracefully. */}
        <div className="mt-5 border-t border-border pt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Contribution graph
            </p>
            <p className="text-[11px] text-muted-foreground/70">last year</p>
          </div>
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <GithubHeatmap user={USERNAME} />
          </div>
        </div>

        {/* CTA line */}
        <p className="mt-5 text-[12.5px] text-muted-foreground">
          Want a closer look?{" "}
          <a
            href="/contact"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            Ask for a code walkthrough
          </a>
          .
        </p>
      </div>
    </motion.div>
  );
}
