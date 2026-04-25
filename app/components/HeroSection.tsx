"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  Bookmark,
  Check,
  Download,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  Search,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

// Real face avatars (Pravatar — placeholder face photos by ID).
const AVATAR_IDS = [12, 32, 47, 56, 65, 11, 25, 38, 49, 68];

function AvatarStack({ seed = 0, count = 5 }: { seed?: number; count?: number }) {
  return (
    <div className="flex -space-x-1.5">
      {Array.from({ length: count }).map((_, i) => {
        const id = AVATAR_IDS[(seed + i) % AVATAR_IDS.length];
        return (
          <Image
            key={i}
            src={`https://i.pravatar.cc/64?img=${id}`}
            alt=""
            width={18}
            height={18}
            loading="lazy"
            unoptimized
            className="h-[18px] w-[18px] rounded-full border-[1.5px] border-card bg-zinc-200 object-cover dark:bg-zinc-700"
          />
        );
      })}
    </div>
  );
}

type ProjectItem = {
  title: string;
  sub: string;
  seed: number;
  avatars: number;
};

const PROJECT_ITEMS: ProjectItem[] = [
  { title: "LMS SaaS Platform", sub: "Multi-Tenant", seed: 0, avatars: 5 },
  { title: "Clinic Desktop App", sub: "Offline-First", seed: 3, avatars: 5 },
  { title: "Multi-Vendor Store", sub: "E-Commerce", seed: 6, avatars: 4 },
];

function ProjectTile({
  title,
  sub,
  seed = 0,
  avatars = 5,
}: {
  title: string;
  sub: string;
  seed?: number;
  avatars?: number;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      className="group cursor-pointer rounded-xl border border-border bg-background/40 p-3 transition-all duration-200 hover:border-blue-400/60 hover:bg-background hover:shadow-[0_8px_20px_-12px_rgba(59,130,246,0.35)]"
    >
      <p className="text-[12px] font-semibold leading-tight text-foreground transition-colors group-hover:text-blue-600">
        {title}
      </p>
      <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
        {sub}
      </p>
      <div className="mt-2.5 transition-transform duration-200 group-hover:translate-x-0.5">
        <AvatarStack seed={seed} count={avatars} />
      </div>
    </motion.div>
  );
}

function ProjectsCard() {
  const [query, setQuery] = useState("");

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-foreground">
          Projects
        </span>
        <button className="flex cursor-pointer items-center gap-1 rounded-full bg-blue-500 px-3 py-1.5 text-[11.5px] font-medium text-white transition-opacity hover:opacity-90">
          <span className="text-[13px] leading-none">+</span>
          <span>New</span>
        </button>
      </div>

      {/* Search field — real input the visitor can type into */}
      <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 transition-colors focus-within:border-blue-400/70">
        <Search size={12} className="shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
          placeholder="Filter projects..."
          className="w-full bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus-visible:outline-none"
        />
      </div>

      {/* 2x2 tiles */}
      <div className="mt-3.5 grid grid-cols-2 gap-2.5">
        {PROJECT_ITEMS.map((p) => (
          <ProjectTile
            key={p.title}
            title={p.title}
            sub={p.sub}
            seed={p.seed}
            avatars={p.avatars}
          />
        ))}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/30 p-3 transition-all duration-200 hover:border-blue-400/70 hover:bg-blue-50/40 dark:hover:bg-blue-950/20"
        >
          <span className="text-[16px] leading-none text-muted-foreground transition-colors group-hover:text-blue-500">
            +
          </span>
          <span className="mt-1.5 text-[11.5px] font-medium text-muted-foreground transition-colors group-hover:text-blue-600">
            New project
          </span>
        </motion.div>
      </div>
    </>
  );
}

// Track length in seconds (matches "75:50" displayed).
const TRACK_DURATION = 75 * 60 + 50;
const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

function PodcastPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(24 * 60 + 16); // start at 24:16
  const [bookmarked, setBookmarked] = useState(false);
  const [repeating, setRepeating] = useState(false);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const scrubberRef = useRef<HTMLDivElement>(null);

  // Simulated playback tick
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = p + speed;
        if (next >= TRACK_DURATION) {
          if (repeating) return 0;
          setPlaying(false);
          return TRACK_DURATION;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, speed, repeating]);

  const pct = (progress / TRACK_DURATION) * 100;

  const seekTo = (clientX: number) => {
    const el = scrubberRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setProgress(Math.round(ratio * TRACK_DURATION));
  };

  const cycleSpeed = () => setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1));

  return (
    <>
      {/* Cover + episode */}
      <div className="flex items-start gap-3">
        <Image
          src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&q=80&auto=format&fit=crop"
          alt="Notes from the Workbench cover"
          width={68}
          height={68}
          loading="lazy"
          sizes="68px"
          className="h-[68px] w-[68px] shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1 pt-1">
          <a className="cursor-pointer text-[12px] font-medium text-blue-500 underline-offset-2 hover:underline">
            Ep. 04
          </a>
          <p className="mt-0.5 truncate text-[12.5px] text-foreground/80">
            Building Offline-First with NestJS &amp; ...
          </p>
          <p className="mt-1 truncate text-[16px] font-bold text-foreground">
            Notes from the Valley
          </p>
        </div>
      </div>

      {/* Scrubber — clickable */}
      <div className="mt-4">
        <div
          ref={scrubberRef}
          onClick={(e) => seekTo(e.clientX)}
          className="group relative h-[10px] cursor-pointer"
        >
          <div className="absolute top-1/2 left-0 right-0 h-[4px] -translate-y-1/2 rounded-full bg-blue-100 dark:bg-blue-950" />
          <div
            className="absolute top-1/2 left-0 h-[4px] -translate-y-1/2 rounded-full bg-blue-500 transition-[width] duration-200 ease-linear"
            style={{ width: `${pct}%` }}
          />
          <span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-blue-500 transition-[left] duration-200 ease-linear group-hover:scale-110"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] tabular-nums text-muted-foreground">
          <span>{fmtTime(progress)}</span>
          <span>{fmtTime(TRACK_DURATION)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between text-foreground/85">
        <button
          aria-label="Bookmark"
          onClick={() => setBookmarked((v) => !v)}
          className={`cursor-pointer transition-colors hover:text-foreground ${
            bookmarked ? "text-blue-500" : ""
          }`}
        >
          <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
        </button>
        <button
          aria-label="Previous"
          onClick={() => setProgress((p) => Math.max(0, p - 30))}
          className="cursor-pointer transition-colors hover:text-foreground"
        >
          <SkipBack size={15} fill="currentColor" />
        </button>
        <button
          aria-label="Restart"
          onClick={() => setProgress(0)}
          className="cursor-pointer transition-colors hover:text-foreground"
        >
          <RotateCcw size={15} />
        </button>
        <button
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((v) => !v)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105 active:scale-95"
        >
          {playing ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" className="ml-0.5" />
          )}
        </button>
        <button
          aria-label="Repeat"
          onClick={() => setRepeating((v) => !v)}
          className={`transition-colors hover:text-foreground ${
            repeating ? "text-blue-500" : ""
          }`}
        >
          <Repeat size={15} />
        </button>
        <button
          aria-label="Forward"
          onClick={() =>
            setProgress((p) => Math.min(TRACK_DURATION, p + 30))
          }
          className="cursor-pointer transition-colors hover:text-foreground"
        >
          <SkipForward size={15} fill="currentColor" />
        </button>
        <button
          aria-label="Playback speed"
          onClick={cycleSpeed}
          className="inline-flex h-6 cursor-pointer items-center rounded-md border border-border px-2 text-[11px] font-medium tabular-nums transition-colors hover:border-foreground/40"
        >
          {speed}×
        </button>
      </div>
    </>
  );
}

function ResumeDownloadButton() {
  type State = "idle" | "downloading" | "done";
  const [state, setState] = useState<State>("idle");
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (state !== "idle") return;
    setState("downloading");
    // Trigger the actual file download.
    linkRef.current?.click();
    // Visual states: downloading → done → idle
    window.setTimeout(() => setState("done"), 900);
    window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <>
      {/* Hidden anchor — performs the actual download. */}
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
        className="group relative inline-flex h-11 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-foreground pl-6 pr-5 text-[13.5px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95 disabled:cursor-default disabled:hover:scale-100 disabled:hover:opacity-100"
        aria-live="polite"
      >
        {/* Sliding progress sheen during download */}
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
          {/* Profile + wave badge.
              Box-1: the outer container that defines the photo's full size.
              Box-2: a shorter rounded bordered box pinned to the bottom — this
              is the frame the visitor sees. The image fills box-1 and is
              rendered on top of box-2, so the body sits inside the box and
              the head naturally extends above its top edge. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative inline-block h-[150px] w-[160px]"
          >
            {/* Box-2 — the visible rounded frame at the bottom.
                Wider than the image; shorter than box-1 so the head clears
                its top edge. */}
            <div className="absolute bottom-0 left-0 right-0 h-[105px] rounded-2xl border border-foreground/20 bg-zinc-100 dark:bg-zinc-800" />

            {/* Image — natural aspect ratio (no cropping). Height is set,
                width auto so the image scales naturally smaller than box-2.
                Hero LCP candidate → priority + fetchPriority high. */}
            <Image
              src="/img/saranzafar-image.png"
              alt="Saran Zafar"
              width={150}
              height={150}
              priority
              fetchPriority="high"
              sizes="160px"
              className="pointer-events-none absolute bottom-0 left-1/2 h-[150px] w-auto -translate-x-1/2 select-none"
            />

            {/* Wave badge — bottom-right of box-2, hanging off the corner */}
            <span
              aria-hidden="true"
              className="absolute -right-1 -bottom-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background text-[17px] shadow-md ring-1 ring-border/60"
            >
              <span className="animate-wave">👋</span>
            </span>
          </motion.div>

          {/* Greeting headline — large + heavy */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-5 text-[58px] font-bold leading-[1.02] tracking-tight text-foreground sm:text-[64px]"
          >
            Hello,
            <br />
            I&apos;m Saran.
          </motion.h1>

          {/* Subtitle — bold, 2 lines */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-5 max-w-[440px] text-[18px] font-bold leading-snug text-foreground"
          >
            Software Engineer | Full-Stack Developer for Backend &amp; Frontend
          </motion.p>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-4 max-w-[440px] text-[14.5px] leading-[1.7] text-muted-foreground"
          >
            I&apos;m a software engineer from Kotli, AJK. I build production
            systems for healthcare, retail, and e-commerce — NestJS REST APIs,
            multi-tenant SaaS, and offline-first Electron desktop apps that
            sync without losing a write.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-3 max-w-[440px] text-[14.5px] leading-[1.7] text-muted-foreground"
          >
            Production websites and enterprise-grade systems shipped, used
            in the real world. Looking to ship something that just works?
            I can help.
          </motion.p>

          {/* Skill bullets */}
          <motion.ul
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="mt-3 space-y-1.5 text-[14px] text-muted-foreground"
          >
            {skills.map((s) => (
              <li key={s} className="flex items-start gap-2.5">
                <span className="mt-[9px] inline-block h-1 w-1 rounded-full bg-foreground/70" />
                <span>{s}</span>
              </li>
            ))}
            <li className="flex items-start gap-2.5">
              <span className="mt-[9px] inline-block h-1 w-1 rounded-full bg-foreground/30" />
              <span>and more...</span>
            </li>
          </motion.ul>

          {/* CTAs — larger pills */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={6}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <ResumeDownloadButton />
            <a
              href="/contact"
              className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-[13.5px] font-medium text-foreground transition-colors duration-200 hover:border-foreground/50 hover:bg-card"
            >
              Contact
            </a>
          </motion.div>
        </div>

        {/* ── RIGHT — floating UI mocks, centered vertically against the left column ─── */}
        <div className="relative hidden h-[480px] md:block">
          {/* Top mock — projects card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="animate-floaty absolute top-0 right-0 w-[360px] rounded-2xl border border-border bg-card p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)]"
          >
            <ProjectsCard />
          </motion.div>

          {/* Bottom mock — interactive podcast / now playing */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="animate-floaty-delayed absolute right-3 top-[290px] w-[330px] rounded-2xl border border-border bg-card p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.22)]"
          >
            <PodcastPlayer />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
