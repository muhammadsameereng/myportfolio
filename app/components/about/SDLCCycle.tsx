"use client";

import { motion } from "framer-motion";
import {
  Ear,
  Hammer,
  Pencil,
  Rocket,
  RefreshCcw,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type Phase = {
  id: string;
  label: string;
  icon: LucideIcon;
  body: string;
};

const PHASES: Phase[] = [
  {
    id: "listen",
    label: "Listen",
    icon: Ear,
    body:
      "Start with the problem, not the framework. Understand who the user is, what the team is constrained by, and what success actually looks like before writing a line of code.",
  },
  {
    id: "plan",
    label: "Plan",
    icon: ListChecks,
    body:
      "Shape the work into something I can defend. Pick the simplest path that survives the obvious failure modes, and write it down so the team can disagree on paper instead of in production.",
  },
  {
    id: "design",
    label: "Design",
    icon: Pencil,
    body:
      "Sketch the data model first, then the API, then the UI. Boring schemas and small interfaces are what let the system grow without rewriting the foundation every six months.",
  },
  {
    id: "build",
    label: "Build",
    icon: Hammer,
    body:
      "Ship in vertical slices. End-to-end working code beats half-finished perfection. Code that reads like English. Reach for the boring tool unless the problem genuinely demands a sharper one.",
  },
  {
    id: "ship",
    label: "Ship",
    icon: Rocket,
    body:
      "Deploys are routine, not rituals. CI catches the silly mistakes, observability catches the surprises, and the rollback path is rehearsed before it is ever needed.",
  },
  {
    id: "refine",
    label: "Refine",
    icon: RefreshCcw,
    body:
      "Real users surface the truth. Listen to what they actually do, fix the rough edges, and feed the lessons back into the next loop. The cycle does not end — it just gets sharper.",
  },
];

const SIZE = 480;
const CENTER = SIZE / 2;
const RADIUS = 168;
const NODE_DIAM = 76;
const PROGRESS_RADIUS = 96;
const PROGRESS_CIRC = 2 * Math.PI * PROGRESS_RADIUS;
const PHASE_MS = 3800;

function nodePos(i: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / PHASES.length;
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

export default function SDLCCycle() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive((i) => (i + 1) % PHASES.length);
    }, PHASE_MS);
    return () => clearInterval(t);
  }, [paused]);

  const phase = PHASES[active];
  const arcLen = (2 * Math.PI * RADIUS) / PHASES.length;

  return (
    <div
      className="mx-auto w-full max-w-[460px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-square w-full">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 h-full w-full text-foreground"
          aria-hidden
        >
          {/* Subtle outer dotted ring — slow rotation conveys "always running" */}
          <motion.g
            animate={{ rotate: paused ? 0 : 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS + 18}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.14}
              strokeWidth={1}
              strokeDasharray="2 6"
            />
          </motion.g>

          {/* Inner soft ring — anchors the geometry */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS - 28}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.06}
            strokeWidth={1}
          />

          {/* Base track (full ring at low opacity) */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={1.5}
          />

          {/* Active arc — one segment that slides around as the active phase changes */}
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeDasharray={`${arcLen * 0.92} ${2 * Math.PI * RADIUS}`}
            initial={false}
            animate={{ rotate: -90 + active * (360 / PHASES.length) - (360 / PHASES.length) / 2 + 4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          />

          {/* Static countdown track — always visible so the user
              knows where the timer lives */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={PROGRESS_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={2.4}
          />

          {/* Active countdown ring — fills from 0 → full over PHASE_MS,
              then resets when the next phase activates. Hidden while
              paused so the wheel reads as "waiting on you". */}
          {!paused && (
            <motion.circle
              key={`progress-${active}`}
              cx={CENTER}
              cy={CENTER}
              r={PROGRESS_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.55}
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeDasharray={PROGRESS_CIRC}
              initial={{ strokeDashoffset: PROGRESS_CIRC }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: PHASE_MS / 1000, ease: "linear" }}
              style={{
                transformOrigin: `${CENTER}px ${CENTER}px`,
                transform: "rotate(-90deg)",
              }}
            />
          )}

          {/* Centre readout — phase number + name */}
          <text
            x={CENTER}
            y={CENTER - 14}
            textAnchor="middle"
            fill="currentColor"
            fillOpacity={0.55}
            style={{
              fontSize: 10.5,
              letterSpacing: 2.4,
              fontWeight: 600,
            }}
          >
            PHASE {String(active + 1).padStart(2, "0")} / {String(PHASES.length).padStart(2, "0")}
          </text>
          <motion.text
            key={phase.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            x={CENTER}
            y={CENTER + 18}
            textAnchor="middle"
            fill="currentColor"
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            {phase.label}
          </motion.text>
          <text
            x={CENTER}
            y={CENTER + 40}
            textAnchor="middle"
            fill="currentColor"
            fillOpacity={0.35}
            style={{ fontSize: 10, letterSpacing: 1.6 }}
          >
            {paused ? "PAUSED" : "AUTO"}
          </text>
        </svg>

        {/* Nodes — DOM buttons over the SVG so icons + a11y just work */}
        {PHASES.map((p, i) => {
          const { x, y } = nodePos(i);
          const isActive = i === active;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-label={`Phase ${i + 1}: ${p.label}`}
              aria-pressed={isActive}
              className={`group absolute flex flex-col items-center justify-center gap-0.5 rounded-full border outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-foreground/40 ${
                isActive
                  ? "scale-[1.08] border-foreground bg-foreground text-background shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)]"
                  : "border-border bg-card text-foreground/65 hover:border-foreground/40 hover:text-foreground"
              }`}
              style={{
                width: NODE_DIAM,
                height: NODE_DIAM,
                left: `calc(${(x / SIZE) * 100}% - ${NODE_DIAM / 2}px)`,
                top: `calc(${(y / SIZE) * 100}% - ${NODE_DIAM / 2}px)`,
              }}
            >
              <Icon size={18} strokeWidth={1.7} />
              <span className="text-[10.5px] font-medium uppercase tracking-[0.12em]">
                {p.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active phase description */}
      <motion.div
        key={phase.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto mt-8 max-w-[460px] text-center"
      >
        <p className="text-[14.5px] leading-[1.7] text-foreground/85">
          {phase.body}
        </p>
      </motion.div>

      {/* Tiny step indicator */}
      <div className="mx-auto mt-5 flex items-center justify-center gap-1.5">
        {PHASES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show phase ${p.label}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 bg-foreground"
                : "w-1.5 bg-foreground/25 hover:bg-foreground/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
