"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, FileText, FolderKanban, Home, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SUGGESTIONS = [
  {
    label: "Home",
    hint: "Start from the beginning",
    href: "/",
    icon: Home,
  },
  {
    label: "Projects",
    hint: "Selected work",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Blog",
    hint: "Notes from the workbench",
    href: "/blog",
    icon: FileText,
  },
  {
    label: "Contact",
    hint: "Get in touch",
    href: "/contact",
    icon: Mail,
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// Per-digit entrance + perpetual float — gives the "404" a small heartbeat.
const digitVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.7, rotate: -6 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      delay: 0.1 + i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function NotFound() {
  const pathname = usePathname() || "/";

  return (
    <main>
      <section className="relative overflow-hidden">
        {/* Soft gradient backdrop — subtle, no FOUC, no JS */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60rem_30rem_at_50%_-10%,rgba(14,116,144,0.10),transparent_60%)]"
        />

        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center md:py-28">
          {/* Eyebrow */}
          <motion.p
            {...fadeUp(0)}
            className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            Lost in the valley
          </motion.p>

          {/* Animated 404 — three digits, staggered + perpetual float */}
          <div
            aria-label="404 — page not found"
            className="mt-5 flex items-end justify-center gap-1 sm:gap-3"
          >
            {["4", "0", "4"].map((d, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={digitVariants}
                initial="hidden"
                animate="show"
                className="inline-block"
              >
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3 + i * 0.4,
                    delay: 0.8 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="block bg-gradient-to-b from-foreground to-foreground/55 bg-clip-text text-[110px] font-bold leading-none tracking-tighter text-transparent sm:text-[160px]"
                >
                  {d}
                </motion.span>
              </motion.span>
            ))}
          </div>

          {/* Title */}
          <motion.h1
            {...fadeUp(0.55)}
            className="mt-6 text-[28px] font-bold tracking-tight text-foreground sm:text-[34px]"
          >
            That page wandered off.
          </motion.h1>

          {/* Lede + tried URL */}
          <motion.p
            {...fadeUp(0.65)}
            className="mt-3 max-w-md text-[14.5px] leading-relaxed text-muted-foreground"
          >
            We can&apos;t find anything at{" "}
            <span className="rounded-md border border-border bg-card px-1.5 py-0.5 text-[12.5px] text-foreground">
              {pathname}
            </span>
            . It may have moved, been renamed, or never existed in the first
            place.
          </motion.p>

          {/* Primary CTA */}
          <motion.div
            {...fadeUp(0.75)}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/"
              className="group inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 text-[13.5px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
            >
              Take me home
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 cursor-pointer items-center rounded-full border border-border bg-background px-6 text-[13.5px] font-medium text-foreground transition-colors duration-200 hover:border-foreground/50 hover:bg-card"
            >
              Report broken link
            </Link>
          </motion.div>

          {/* Suggestion cards — staggered grid */}
          <motion.div
            {...fadeUp(0.9)}
            className="mt-14 w-full"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Or try one of these
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SUGGESTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 1.0 + i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -3 }}
                  >
                    <Link
                      href={s.href}
                      className="group flex h-full flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-colors duration-200 hover:border-foreground/30"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground/80 transition-colors group-hover:text-foreground">
                        <Icon size={15} strokeWidth={1.8} />
                      </span>
                      <p className="text-[13px] font-semibold tracking-tight text-foreground">
                        {s.label}
                      </p>
                      <p className="text-[11.5px] leading-snug text-muted-foreground">
                        {s.hint}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-foreground">
                        Open
                        <ArrowUpRight
                          size={12}
                          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
