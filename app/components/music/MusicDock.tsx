"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { useRef, useState } from "react";
import { useMusic } from "./MusicProvider";

const fmt = (ms: number) => {
  if (!ms || !Number.isFinite(ms)) return "0:00";
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

/* Three-bar equalizer that animates only while audio is playing.
   Sits next to the title — the only "I am alive" cue we need. */
function EqBars({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-3 shrink-0 items-end gap-[2px]"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block w-[2px] rounded-sm bg-foreground"
          initial={false}
          animate={
            active
              ? { scaleY: [0.35, 1, 0.55, 0.85, 0.4] }
              : { scaleY: 0.3 }
          }
          transition={
            active
              ? {
                  duration: 0.9 + i * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.08,
                }
              : { duration: 0.25, ease: "easeOut" }
          }
          style={{ height: "100%", originY: 1 }}
        />
      ))}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Shared progress bar — used by both desktop scrubber + mobile bar.
 * The morph between mobile playing / paused widths animates via the
 * parent flex layout, not via this component.
 * ────────────────────────────────────────────────────────────────────── */
function ProgressBar({
  pct,
  hover,
  onScrub,
  trackRef,
  setHover,
  thick = false,
}: {
  pct: number;
  hover: boolean;
  onScrub: (clientX: number) => void;
  trackRef: React.RefObject<HTMLDivElement | null>;
  setHover: (v: boolean) => void;
  thick?: boolean;
}) {
  const baseH = thick ? "h-[4px]" : "h-[3px]";
  const hotH = thick ? "h-[6px]" : "h-[5px]";
  return (
    <div
      ref={trackRef}
      onClick={(e) => onScrub(e.clientX)}
      onPointerDown={(e) => {
        onScrub(e.clientX);
        const move = (ev: PointerEvent) => onScrub(ev.clientX);
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative h-3 w-full cursor-pointer touch-none"
    >
      <div
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-foreground/15 transition-all duration-200 ${
          hover ? hotH : baseH
        }`}
      />
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-foreground transition-all duration-150 ease-linear ${
          hover ? hotH : baseH
        }`}
        style={{ width: `${pct}%` }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]"
        initial={false}
        animate={{
          scale: hover ? 1 : 0,
          opacity: hover ? 1 : 0,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Play / Pause button — single source of truth for the central control.
 * Includes the breathing ring + icon cross-fade.
 * ────────────────────────────────────────────────────────────────────── */
function PlayPauseButton({
  playing,
  onClick,
  size = "md",
}: {
  playing: boolean;
  onClick: () => void;
  size?: "md" | "lg";
}) {
  const dim =
    size === "lg" ? "h-10 w-10" : "h-8 w-8 sm:h-9 sm:w-9";
  const iconSize = size === "lg" ? 14 : 13;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={playing ? "Pause" : "Play"}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.07 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground text-background ${dim}`}
    >
      {playing ? (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-foreground/40"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        {playing ? (
          <motion.span
            key="pause"
            initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex"
          >
            <Pause size={iconSize} fill="currentColor" />
          </motion.span>
        ) : (
          <motion.span
            key="play"
            initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex"
          >
            <Play size={iconSize} fill="currentColor" className="ml-[1.5px]" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function MusicDock() {
  const m = useMusic();
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [hoverDesktop, setHoverDesktop] = useState(false);
  const [hoverMobile, setHoverMobile] = useState(false);

  const pct =
    m.duration > 0 ? Math.min(100, (m.position / m.duration) * 100) : 0;

  const seekFromClient = (
    ref: React.RefObject<HTMLDivElement | null>,
    clientX: number,
  ) => {
    const el = ref.current;
    if (!el || !m.duration) return;
    const r = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    m.seek(Math.round(ratio * m.duration));
  };

  const titleKey = m.title || (m.loading ? "loading" : "empty");

  // Pre-playback state on mobile — the dock itself is the trigger.
  const ready = m.title.length > 0 || m.position > 0;
  const placeholderTitle = m.loading
    ? "Connecting…"
    : ready
      ? m.title || "Untitled"
      : "Tap to play music";

  return (
    <>
      {/* ═══════════════════ DESKTOP (m.open-gated) ═══════════════════ */}
      <AnimatePresence>
        {m.open ? (
          <motion.aside
            key="music-dock-desktop"
            role="region"
            aria-label="Music player"
            initial={{ y: 28, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 30,
              mass: 0.7,
            }}
            className="fixed inset-x-0 bottom-6 z-50 hidden px-6 sm:block"
          >
            <div className="group/dock mx-auto flex h-14 max-w-5xl items-center gap-4 rounded-full border border-border/40 bg-background/65 px-3 pl-4 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.12)] backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-300 hover:shadow-[0_12px_32px_-14px_rgba(0,0,0,0.18)]">
            <div className="flex shrink-0 items-center gap-1">
              <motion.button
                type="button"
                onClick={m.prev}
                aria-label="Previous track"
                whileTap={{ scale: 0.9 }}
                className="group/prev inline-flex h-8 w-8 cursor-pointer items-center justify-center text-foreground/55 transition-colors duration-200 hover:text-foreground"
              >
                <SkipBack
                  size={16}
                  fill="currentColor"
                  className="transition-transform duration-200 group-hover/prev:-translate-x-[2px]"
                />
              </motion.button>

              <PlayPauseButton playing={m.playing} onClick={m.toggle} />

              <motion.button
                type="button"
                onClick={m.next}
                aria-label="Next track"
                whileTap={{ scale: 0.9 }}
                className="group/next inline-flex h-8 w-8 cursor-pointer items-center justify-center text-foreground/55 transition-colors duration-200 hover:text-foreground"
              >
                <SkipForward
                  size={16}
                  fill="currentColor"
                  className="transition-transform duration-200 group-hover/next:translate-x-[2px]"
                />
              </motion.button>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground transition-colors duration-200 group-hover/dock:text-foreground/70">
                {fmt(m.position)}
              </span>

              <ProgressBar
                pct={pct}
                hover={hoverDesktop}
                setHover={setHoverDesktop}
                trackRef={desktopTrackRef}
                onScrub={(x) => seekFromClient(desktopTrackRef, x)}
              />

              <span className="font-mono text-[11px] tabular-nums text-muted-foreground transition-colors duration-200 group-hover/dock:text-foreground/70">
                {fmt(m.duration)}
              </span>
            </div>

            <div className="flex min-w-0 max-w-[220px] shrink-0 items-center gap-2">
              <EqBars active={m.playing} />
              <div className="min-w-0 flex-1 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={titleKey}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="truncate text-[12.5px] font-medium leading-tight text-foreground">
                      {m.loading && !m.title
                        ? "Connecting…"
                        : m.title || "Untitled"}
                    </p>
                    {m.artist ? (
                      <p className="truncate text-[10.5px] leading-tight text-muted-foreground">
                        {m.artist}
                      </p>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={m.dismiss}
              aria-label="Close player"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
              className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <X size={15} />
            </motion.button>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {/* ═══════════════════ MOBILE (always rendered) ═══════════════════
          The mobile dock is its own trigger — tapping play loads the
          SoundCloud script + iframe and starts playback. No reliance on
          the desktop-only hero podcast mock.
      ═══════════════════════════════════════════════════════════════ */}
      <motion.aside
        role="region"
        aria-label="Music player"
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        className="fixed inset-x-0 bottom-4 z-50 px-4 sm:hidden"
      >
        {/* MOBILE — morphing widget
              Morphing widget. Same outer pill (glass), but the inner
              row reshapes between states:

                paused  →  [▶ play]  ━━━━━━━━━━━━━━━━━━  (just a bar)
                playing →  [❚❚ pause]  ━━━━━━━━━●━━━━  [‹] [›]

              Prev/next slide in from the right + fade when playing,
              the bar contracts to make room. When paused they fade
              out + slide back; the bar expands to fill the freed
              space. Layout uses framer-motion `layout` so the
              widths animate smoothly without jank.
          ═══════════════════════════════════════════════ */}
          <motion.div
            layout
            transition={{
              layout: { type: "spring", stiffness: 260, damping: 28 },
            }}
            className="mx-auto flex h-14 max-w-md items-center gap-3 rounded-full border border-border/40 bg-background/70 px-3 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.14)] backdrop-blur-xl backdrop-saturate-150"
          >
            <PlayPauseButton
              playing={m.playing}
              onClick={m.toggle}
              size="lg"
            />

            {/* The bar — always present, fills whatever space is free.
                Title floats above as a single line; tap-to-seek active
                in both states so the visitor can scrub even when paused. */}
            <motion.div
              layout
              className="relative flex min-w-0 flex-1 flex-col justify-center gap-1.5"
            >
              <div className="flex items-center justify-between gap-3 px-0.5">
                <div className="flex min-w-0 items-center gap-1.5">
                  <EqBars active={m.playing} />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={placeholderTitle}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className={`truncate text-[11.5px] font-medium leading-none ${
                        ready ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {placeholderTitle}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <span className="shrink-0 font-mono text-[10px] tabular-nums leading-none text-muted-foreground">
                  {fmt(m.position)}
                  <span className="mx-1 text-border">/</span>
                  {fmt(m.duration)}
                </span>
              </div>

              <ProgressBar
                pct={pct}
                hover={hoverMobile}
                setHover={setHoverMobile}
                trackRef={mobileTrackRef}
                onScrub={(x) => seekFromClient(mobileTrackRef, x)}
                thick
              />
            </motion.div>

            {/* Prev / Next — only mount while playing, with a soft
                stagger so they slide in one after the other from the
                right. Exit reverses (last out first), giving the bar
                a clean room-to-grow gesture as the controls retract. */}
            <AnimatePresence initial={false}>
              {m.playing ? (
                <motion.div
                  key="prevnext"
                  layout
                  initial={{ opacity: 0, x: 24, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: 24, width: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 28,
                  }}
                  className="flex shrink-0 items-center gap-0.5 overflow-hidden"
                >
                  <motion.button
                    type="button"
                    onClick={m.prev}
                    aria-label="Previous track"
                    whileTap={{ scale: 0.85 }}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: 0.04, duration: 0.22 }}
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center text-foreground/65 active:text-foreground"
                  >
                    <SkipBack size={15} fill="currentColor" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={m.next}
                    aria-label="Next track"
                    whileTap={{ scale: 0.85 }}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: 0.1, duration: 0.22 }}
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center text-foreground/65 active:text-foreground"
                  >
                    <SkipForward size={15} fill="currentColor" />
                  </motion.button>
                </motion.div>
              ) : null}
            </AnimatePresence>
        </motion.div>
      </motion.aside>
    </>
  );
}
