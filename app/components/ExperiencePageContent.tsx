"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Database,
  Layers,
  Server,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import SectionHead from "./SectionHead";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/* ─────────────────────────  Backend — laptop  ───────────────────────── */

// Syntax token colours (classic editor palette — reads well on the dark screen).
const TC: Record<string, string> = {
  kw: "#c586c0", // keyword
  fn: "#4ec9b0", // function
  va: "#9cdcfe", // variable
  st: "#ce9178", // string
  nu: "#b5cea8", // number
  cm: "#6a9955", // comment
  pn: "#7f8b98", // punctuation
};

type Tok = [keyof typeof TC | string, number];
const CODE_LINES: { ind: number; t: Tok[] }[] = [
  { ind: 0, t: [["cm", 128]] },
  { ind: 0, t: [["kw", 46], ["fn", 74], ["pn", 12], ["va", 30]] },
  { ind: 1, t: [["kw", 34], ["va", 52], ["pn", 10], ["fn", 66], ["st", 40]] },
  { ind: 1, t: [["va", 44], ["pn", 10], ["fn", 70], ["nu", 22]] },
  { ind: 2, t: [["fn", 58], ["va", 40], ["st", 78]] },
  { ind: 2, t: [["kw", 30], ["va", 60], ["pn", 12], ["nu", 26]] },
  { ind: 1, t: [["kw", 32], ["fn", 68]] },
  { ind: 0, t: [["pn", 12]] },
  { ind: 0, t: [["cm", 96]] },
  { ind: 0, t: [["kw", 40], ["fn", 84], ["va", 34]] },
];

function CodeLine({ ind, t, caret }: { ind: number; t: Tok[]; caret?: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 py-[3.5px]"
      style={{ paddingLeft: ind * 16 }}
    >
      {t.map(([c, w], i) => (
        <span
          key={i}
          className="h-[6px] rounded-sm"
          style={{ width: w, background: TC[c as string] }}
        />
      ))}
      {caret && (
        <span
          className="exp-caret ml-0.5 inline-block h-[11px] w-[2px] bg-white/80"
          style={{ animation: "exp-caret 1s steps(2) infinite" }}
        />
      )}
    </div>
  );
}

function LaptopMock() {
  const stream = [...CODE_LINES, ...CODE_LINES];
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(58% 58% at 40% 30%, rgb(var(--bg-teal) / 0.4), transparent 70%)",
        }}
      />
      {/* Screen */}
      <div className="overflow-hidden rounded-t-xl border border-border bg-[#0d1f1c] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-[10px] text-white/40">
            users.service.ts
          </span>
        </div>
        <div className="relative h-[224px] overflow-hidden px-4 py-3">
          <div
            className="code-stream-inner"
            style={{ animation: "code-stream 14s linear infinite" }}
          >
            {stream.map((ln, i) => (
              <CodeLine
                key={i}
                ind={ln.ind}
                t={ln.t}
                caret={i % CODE_LINES.length === CODE_LINES.length - 1}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-9 bg-gradient-to-b from-[#0d1f1c] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-[#0d1f1c] to-transparent" />
        </div>
      </div>
      {/* Base */}
      <div className="mx-auto h-3 w-[110%] -translate-x-[4.5%] rounded-b-xl border border-t-0 border-border bg-gradient-to-b from-[#3a3a3a] to-[#1c1c1c] dark:from-[#2a2a2a] dark:to-[#141414]" />
      <div className="mx-auto h-1.5 w-[64%] rounded-b-lg bg-[#0f0f0f]" />
    </div>
  );
}

/* ─────────────────────────  Mobile — phone  ─────────────────────────── */

function Bar({ w, c = "bg-white/15", h = "h-2" }: { w: number | string; c?: string; h?: string }) {
  return <span className={`block rounded-full ${h} ${c}`} style={{ width: w }} />;
}

function PhoneMock() {
  return (
    <div className="relative mx-auto w-[220px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(55% 50% at 30% 25%, rgb(var(--bg-teal) / 0.38), transparent 70%), radial-gradient(55% 50% at 80% 85%, rgb(var(--bg-amber) / 0.3), transparent 70%)",
        }}
      />
      <div className="relative aspect-[9/19] overflow-hidden rounded-[2.4rem] border-[7px] border-[#161616] bg-[#071413] shadow-[0_28px_70px_-30px_rgba(0,0,0,0.6)]">
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-[#161616]" />
        {/* Screen — a mini version of this very site, gently auto-scrolling */}
        <div className="h-full overflow-hidden pt-7">
          <div
            className="phone-scroll-inner space-y-3 px-3"
            style={{ animation: "phone-scroll 10s ease-in-out infinite alternate" }}
          >
            {/* mini nav */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[9px] font-semibold text-white/80">✦ msameer</span>
              <span className="h-3 w-3 rounded-full border border-white/25" />
            </div>
            {/* mini hero */}
            <div
              className="mx-auto h-16 w-14 rounded-xl"
              style={{ background: "linear-gradient(160deg, #0e7490, #d98a3d)" }}
            />
            <Bar w="80%" c="bg-white/80" h="h-2.5" />
            <Bar w="55%" c="bg-white/40" />
            <span
              className="block h-5 w-20 rounded-full"
              style={{ background: "linear-gradient(135deg, #0e7490, #d98a3d)" }}
            />
            {/* mini cards */}
            {[0, 1, 2].map((k) => (
              <div key={k} className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
                <div
                  className="mb-1.5 h-12 w-full rounded-lg"
                  style={{
                    background:
                      k % 2 === 0
                        ? "linear-gradient(135deg, rgba(14,116,144,0.5), rgba(217,138,61,0.3))"
                        : "linear-gradient(135deg, rgba(217,138,61,0.4), rgba(14,116,144,0.4))",
                  }}
                />
                <Bar w="70%" c="bg-white/45" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Floating tech badges */}
      <span className="animate-floaty absolute -left-5 top-16 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm">
        Flutter
      </span>
      <span className="animate-floaty-delayed absolute -right-6 bottom-20 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm">
        React Native
      </span>
    </div>
  );
}

/* ─────────────────────────  Full Stack — flow  ──────────────────────── */

function StackMock() {
  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 20%, rgb(var(--bg-teal) / 0.34), transparent 70%), radial-gradient(55% 55% at 50% 90%, rgb(var(--bg-amber) / 0.26), transparent 70%)",
        }}
      />
      {/* Browser — front end */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_20px_50px_-28px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="ml-2 h-3.5 flex-1 rounded-full bg-foreground/[0.06]" />
        </div>
        <div className="space-y-2 p-3.5">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg" style={{ background: "linear-gradient(135deg, #0e7490, #d98a3d)" }} />
            <div className="space-y-1.5">
              <Bar w={90} c="bg-foreground/25" />
              <Bar w={60} c="bg-foreground/15" />
            </div>
            <span className="ml-auto h-6 w-16 rounded-full" style={{ background: "linear-gradient(135deg, #0e7490, #d98a3d)" }} />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[0, 1, 2].map((k) => (
              <div key={k} className="h-10 rounded-lg bg-foreground/[0.05]" />
            ))}
          </div>
        </div>
      </div>

      {/* Connection with travelling data packets */}
      <div className="relative mx-auto my-1.5 h-20 w-px bg-border">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="data-packet absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-accent"
            style={{
              animation: `data-flow 2.4s linear ${i * 0.8}s infinite`,
              boxShadow: "0 0 8px rgb(var(--bg-teal) / 0.8)",
            }}
          />
        ))}
      </div>

      {/* Back end — API + DB */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-2.5">
          <Server size={15} className="text-accent" strokeWidth={1.9} />
          <span className="text-[12px] font-medium text-foreground">NestJS API</span>
          <Bar w={44} c="bg-foreground/12" />
          <span className="ml-auto text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            REST
          </span>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-2.5">
          <Database size={15} className="text-accent" strokeWidth={1.9} />
          <span className="text-[12px] font-medium text-foreground">PostgreSQL</span>
          <Bar w={36} c="bg-foreground/12" />
          <span className="ml-auto text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            data
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────  Lanes  ──────────────────────────────── */

type Lane = {
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  blurb: string;
  points: string[];
  tags: string[];
  Mock: ComponentType;
};

const LANES: Lane[] = [
  {
    eyebrow: "01 · Backend",
    title: "Backend Development",
    icon: Server,
    blurb:
      "APIs and services that stay boring on purpose — typed, tested, and calm under load. NestJS and Node.js over PostgreSQL, with clean service boundaries, queues, and offline-first sync.",
    points: [
      "REST APIs & JWT auth with NestJS / Express",
      "PostgreSQL, MongoDB, Redis & RabbitMQ",
      "Offline-first sync with CouchDB / PouchDB",
      "Docker, nginx & AWS EC2 deployments",
    ],
    tags: ["NestJS", "Node.js", "PostgreSQL", "Redis", "Docker", "AWS"],
    Mock: LaptopMock,
  },
  {
    eyebrow: "02 · Mobile",
    title: "Mobile App Development",
    icon: Smartphone,
    blurb:
      "Cross-platform apps that feel native — React Native (Expo) when the team shares React muscle memory, Flutter when the UI is heavy and custom. Timetables, POS, live tracking, and social feeds.",
    points: [
      "React Native (Expo) & Flutter",
      "Offline-capable, JWT-secured flows",
      "Live tracking & notifications via Firebase",
      "One shared API layer with the web",
    ],
    tags: ["React Native", "Flutter", "Expo", "Firebase"],
    Mock: PhoneMock,
  },
  {
    eyebrow: "03 · Full Stack",
    title: "Full-Stack Development",
    icon: Layers,
    blurb:
      "Owning the seam between data and interface — data model → API → UI → deploy. Next.js / React front ends wired to NestJS back ends and shipped, end to end.",
    points: [
      "Next.js / React front ends",
      "Type-safe end to end with TypeScript",
      "Multi-tenant SaaS architecture",
      "CI/CD straight to production",
    ],
    tags: ["Next.js", "React", "TypeScript", "NestJS", "CI/CD"],
    Mock: StackMock,
  },
];

export default function ExperiencePageContent() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <SectionHead
          title="Experience"
          description="Three lanes I build in — backend, mobile, and full-stack. Same engineer across the whole stack."
        />

        <div className="mt-14 space-y-20 md:space-y-28">
          {LANES.map((lane, i) => {
            const Icon = lane.icon;
            const Mock = lane.Mock;
            const flip = i % 2 === 1;
            return (
              <div
                key={lane.title}
                className="grid items-center gap-10 md:grid-cols-2 md:gap-14"
              >
                {/* Device mock */}
                <motion.div
                  {...fadeUp(0)}
                  className={flip ? "md:order-2" : "md:order-1"}
                >
                  <Mock />
                </motion.div>

                {/* Copy */}
                <motion.div
                  {...fadeUp(0.08)}
                  className={flip ? "md:order-1" : "md:order-2"}
                >
                  <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
                    <Icon size={13} className="text-accent" strokeWidth={2} />
                    {lane.eyebrow}
                  </p>
                  <h2 className="mt-4 text-[26px] font-bold leading-tight tracking-tight text-foreground sm:text-[30px]">
                    {lane.title}
                  </h2>
                  <p className="mt-3 max-w-[480px] text-[14.5px] leading-[1.75] text-muted-foreground">
                    {lane.blurb}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {lane.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[13.5px] text-foreground/85">
                        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                          <Check size={11} strokeWidth={2.6} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {lane.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-border bg-card/60 px-2.5 py-1 text-[12px] text-muted-foreground"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          {...fadeUp(0)}
          className="relative mt-20 overflow-hidden rounded-2xl border border-accent/25 bg-card p-8 text-center sm:p-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, rgb(var(--bg-teal) / 0.28), transparent 70%)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, rgb(var(--bg-amber) / 0.22), transparent 70%)" }}
          />
          <h2 className="relative text-[22px] font-bold tracking-tight text-foreground sm:text-[26px]">
            Need one engineer for the whole stack?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Backend, mobile, or the full product — I can take it from data model
            to deployed app.
          </p>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href="/contact"
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
            >
              Start a project
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-5 text-[13px] font-medium text-foreground transition-colors duration-200 hover:border-accent/50 hover:bg-card"
            >
              See the work
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
