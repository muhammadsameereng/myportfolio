"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Download } from "lucide-react";
import { useRef, useState } from "react";
import TiltPortrait from "./TiltPortrait";

const skills = [
  "React & Next.js frontends with TypeScript & Tailwind CSS",
  "Backend APIs with Node.js, NestJS & Express",
  "Cross-platform mobile with React Native & Flutter",
  "Multi-tenant SaaS — LMS, social commerce & delivery",
  "Docker, AWS EC2, nginx & CI/CD pipelines",
];

function ResumeDownloadButton() {
  type State = "idle" | "downloading" | "done";
  const [state, setState] = useState<State>("idle");
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (state !== "idle") return;
    setState("downloading");
    linkRef.current?.click();
    window.setTimeout(() => setState("done"), 900);
    window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <>
      <a
        ref={linkRef}
        href="/msameer-cv.pdf"
        download="Muhammad-Sameer-CV.pdf"
        aria-hidden="true"
        tabIndex={-1}
        className="hidden"
      />

      <motion.button
        type="button"
        onClick={handleClick}
        disabled={state !== "idle"}
        whileTap={state === "idle" ? { scale: 0.97 } : undefined}
        className="group relative inline-flex h-11 cursor-pointer items-center gap-2 overflow-hidden rounded-full pl-6 pr-5 text-[13.5px] font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-95 disabled:cursor-default disabled:hover:scale-100 disabled:hover:opacity-100"
        style={{ background: "linear-gradient(135deg, #0e7490 0%, #d98a3d 100%)" }}
        aria-live="polite"
      >
        <AnimatePresence>
          {state === "downloading" && (
            <motion.span
              key="sheen"
              aria-hidden="true"
              initial={{ x: "-110%" }}
              animate={{ x: "110%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {state === "idle" && (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex items-center gap-2"
            >
              Download Resume
              <Download
                size={15}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </motion.span>
          )}

          {state === "downloading" && (
            <motion.span
              key="downloading"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex items-center gap-2"
            >
              Downloading
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex"
              >
                <Download size={15} strokeWidth={2} />
              </motion.span>
            </motion.span>
          )}

          {state === "done" && (
            <motion.span
              key="done"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex items-center gap-2"
            >
              Downloaded
              <motion.span
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-background"
              >
                <Check size={11} strokeWidth={3} />
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Ambient palette wash — teal + amber, pulled from the portrait.
          Purely decorative, sits behind everything and never intercepts
          clicks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(45% 40% at 78% 12%, var(--glow), transparent 70%), radial-gradient(40% 35% at 10% 90%, color-mix(in oklab, var(--accent-warm) 14%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 pt-10 pb-14 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:pt-16 md:pb-20">
        {/* ── PORTRAIT — 3D tilt, first on mobile ─────────────────────── */}
        <TiltPortrait
          className="order-1 mx-auto w-full max-w-[300px] sm:max-w-[340px] md:order-2 md:max-w-none"
          src="/img/msameer-image.png"
          alt="Muhammad Sameer — Full-Stack Software Engineer"
          priority
          sizes="(max-width: 768px) 340px, 460px"
          badge={
            <span
              aria-hidden="true"
              className="absolute -right-2 -top-2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-background text-[20px] shadow-md ring-1 ring-border/60"
            >
              <span className="animate-wave">👋</span>
            </span>
          }
        />

        {/* ── IDENTITY — text, second on mobile ───────────────────────── */}
        <div className="order-2 md:order-1">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Available for work
          </p>

          <h1 className="mt-5 text-[46px] font-bold leading-[1.03] tracking-tight text-foreground sm:text-[56px]">
            Hello,
            <br />
            I&apos;m{" "}
            <span className="bg-gradient-to-r from-accent to-accent-warm bg-clip-text text-transparent">
              Sameer
            </span>
            .
          </h1>

          <p className="mt-5 max-w-[460px] text-[17px] font-semibold leading-snug text-foreground">
            Full-Stack Software Engineer — React &amp; Next.js · Node.js &amp;
            NestJS · React Native
          </p>

          <p className="mt-4 max-w-[460px] text-[14.5px] leading-[1.7] text-muted-foreground">
            I&apos;m a software engineer from Kotli, Azad Kashmir. I build
            production systems end-to-end — React / Next.js interfaces backed
            by Node.js and NestJS APIs, multi-tenant SaaS platforms, and
            cross-platform mobile apps.
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {skills.map((s) => (
              <li
                key={s}
                className="rounded-full border border-border bg-card/60 px-3 py-1 text-[12.5px] text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ResumeDownloadButton />
            <a
              href="/contact"
              className="inline-flex h-11 items-center rounded-full border border-accent/50 bg-background px-6 text-[13.5px] font-medium text-accent transition-colors duration-200 hover:border-accent hover:bg-accent/5"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
