"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import GithubHeatmap from "./GithubHeatmap";

function GithubMark({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const USERNAME = "saranzafar";

// Monochrome theme — site is intentionally black/white/grey. Same widget
// is rendered twice (light + dark variants) and toggled with Tailwind
// `dark:` so the SVG matches whichever mode the visitor is in.
const buildStreakUrl = (mode: "light" | "dark") => {
  const fg     = mode === "light" ? "0a0a0a" : "fafafa";
  const muted  = mode === "light" ? "6b7280" : "9ca3af";
  return (
    `https://streak-stats.demolab.com/?user=${USERNAME}` +
    `&theme=transparent&hide_border=true&background=00000000` +
    `&hide_current_streak=true` +
    `&ring=${fg}&fire=${fg}` +
    `&currStreakLabel=${fg}&currStreakNum=${fg}` +
    `&sideLabels=${muted}&dates=${muted}&stroke=${muted}` +
    `&sideNums=${fg}` +
    `&card_width=520&card_height=200`
  );
};

const STREAK_URL_LIGHT = buildStreakUrl("light");
const STREAK_URL_DARK  = buildStreakUrl("dark");


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
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/[0.05] text-foreground/75">
            <GithubMark size={15} />
          </span>
          <div>
            <p className="text-[13px] font-semibold tracking-tight text-foreground">
              On GitHub
            </p>
            <p className="text-[11.5px] text-muted-foreground">
              Live signal — pulled straight from {`@${USERNAME}`}
            </p>
          </div>
        </div>
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background px-4 text-[12.5px] font-medium text-foreground transition-colors hover:border-foreground/50 hover:bg-card"
        >
          Visit profile
          <ArrowUpRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>

      {/* Streak card — Total Contributions (left) + Longest Streak (right).
          Centre "Current Streak" panel is hidden via `hide_current_streak`. */}
      <div className="flex justify-center px-4 py-6 sm:px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={STREAK_URL_LIGHT}
          alt={`GitHub streak stats for ${USERNAME}`}
          loading="lazy"
          className="block h-auto w-full max-w-[520px] dark:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={STREAK_URL_DARK}
          alt={`GitHub streak stats for ${USERNAME}`}
          loading="lazy"
          className="hidden h-auto w-full max-w-[520px] dark:block"
        />
      </div>

      {/* Contribution heatmap */}
      <div className="border-t border-border bg-background/40 px-4 py-6 sm:px-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Contribution graph
          </p>
          <p className="text-[11px] text-muted-foreground/70">last year</p>
        </div>
        {/* Horizontal scroll on mobile so the full year is preserved */}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <GithubHeatmap user={USERNAME} />
        </div>
      </div>
    </motion.div>
  );
}
