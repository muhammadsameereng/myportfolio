"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Check, Download } from "lucide-react";
import { useRef, useState } from "react";

// Desktop-only mocks (ProjectsCard + PodcastPlayer). Code-split + skip
// SSR — they never render on mobile (`hidden md:block`), and on desktop
// they hydrate after the critical hero text. This keeps ~30 KB of
// useState/useRef/useEffect + framer-motion springs out of the initial
// JS bundle that gates LCP.
const HeroMocks = dynamic(() => import("./HeroMocks"), { ssr: false });

const skills = [
  "Backend APIs with NestJS, Node.js & TypeScript",
  "Web apps with Next.js, React & Tailwind CSS",
  "Multi-tenant SaaS architecture & REST design",
  "Offline-first desktop apps with Electron, CouchDB & PouchDB",
  "Docker, GitLab CI/CD, AWS EC2 & Linux",
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.07, duration: 0.5, ease: "easeOut" as const },
  }),
};

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
        href="/saranzafar-cv.pdf"
        download="Saran-Zafar-CV.pdf"
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
        style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
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
    <section id="home" className="relative">
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 pt-14 pb-12 md:grid-cols-[1fr_1fr] md:gap-10 md:pt-20 md:pb-16">
        {/* ── LEFT — identity ─────────────────────────── */}
        <div>
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative inline-block h-[150px] w-[160px]"
          >
            <div className="absolute bottom-0 left-0 right-0 h-[105px] rounded-2xl border border-foreground/20 bg-zinc-100 dark:bg-zinc-800" />

            <Image
              src="/img/saranzafar-image.png"
              alt="Saran Zafar"
              width={300}
              height={291}
              priority
              fetchPriority="high"
              sizes="160px"
              style={{ height: "150px", width: "auto" }}
              className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 select-none"
            />

            <span
              aria-hidden="true"
              className="absolute -right-1 -bottom-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background text-[17px] shadow-md ring-1 ring-border/60"
            >
              <span className="animate-wave">👋</span>
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={1}
            className="mt-5 text-[58px] font-bold leading-[1.02] tracking-tight text-foreground sm:text-[64px]"
          >
            Hello,
            <br />
            I&apos;m Saran.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={2}
            className="mt-5 max-w-[440px] text-[18px] font-bold leading-snug text-foreground"
          >
            Software Engineer | Full-Stack Developer for Backend &amp; Frontend
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={3}
            className="mt-4 max-w-[440px] text-[14.5px] leading-[1.7] text-muted-foreground"
          >
            I&apos;m a software engineer from AJK, Pakistan. I build production
            systems across healthcare, retail and e-commerce — NestJS REST APIs,
            multi-tenant SaaS, offline-first Electron desktop apps that sync
            without losing a write, and WordPress / WooCommerce sites clients
            can run themselves.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={4}
            className="mt-3 max-w-[440px] text-[14.5px] leading-[1.7] text-muted-foreground"
          >
            Production websites and enterprise-grade systems shipped, used
            in the real world. Looking to ship something that just works?
            I can help.
          </motion.p>

          <motion.ul
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={5}
            className="mt-3 space-y-1.5 text-[14px] text-muted-foreground"
          >
            {skills.map((s) => (
              <li key={s} className="flex items-start gap-2.5">
                <span className="mt-[9px] inline-block h-1.5 w-1.5 rounded-full bg-accent/80" />
                <span>{s}</span>
              </li>
            ))}
            <li className="flex items-start gap-2.5">
              <span className="mt-[9px] inline-block h-1.5 w-1.5 rounded-full bg-accent/30" />
              <span>and more...</span>
            </li>
          </motion.ul>

          <motion.div
            variants={fadeUp}
            initial={false}
            animate="show"
            custom={6}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <ResumeDownloadButton />
            <a
              href="/contact"
              className="inline-flex h-11 items-center rounded-full border border-accent/50 bg-background px-6 text-[13.5px] font-medium text-accent transition-colors duration-200 hover:border-accent hover:bg-accent/5"
            >
              Contact
            </a>
          </motion.div>
        </div>

        {/* ── RIGHT — desktop-only decorative mocks, lazily hydrated ─── */}
        <HeroMocks />
      </div>
    </section>
  );
}
