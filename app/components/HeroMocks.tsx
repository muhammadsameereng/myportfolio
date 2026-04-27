"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Bookmark,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  Search,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-foreground">
          Projects
        </span>
        <button className="flex cursor-pointer items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-[11.5px] font-medium text-white transition-opacity hover:opacity-90">
          <span className="text-[13px] leading-none">+</span>
          <span>New</span>
        </button>
      </div>

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

const TRACK_DURATION = 75 * 60 + 50;
const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

function PodcastPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(24 * 60 + 16);
  const [bookmarked, setBookmarked] = useState(false);
  const [repeating, setRepeating] = useState(false);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const scrubberRef = useRef<HTMLDivElement>(null);

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

// Desktop-only decorative widgets — code-split out of the initial bundle.
// These cards are `hidden md:block` so mobile never paints them; on desktop
// they hydrate after the critical hero text has rendered, keeping the
// LCP element off the main-thread hot path during initial load.
export default function HeroMocks() {
  return (
    <div className="relative hidden h-[480px] md:block">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="animate-floaty absolute top-0 right-0 w-[360px] rounded-2xl border border-border bg-card p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)]"
      >
        <ProjectsCard />
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="animate-floaty-delayed absolute right-3 top-[290px] w-[330px] rounded-2xl border border-border bg-card p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.22)]"
      >
        <PodcastPlayer />
      </motion.div>
    </div>
  );
}
