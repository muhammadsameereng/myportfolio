"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Coffee,
  Compass,
  Download,
  Eye,
  Globe,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import SectionHead from "./SectionHead";
import TiltPortrait from "./TiltPortrait";
import SDLCCycle from "./about/SDLCCycle";
import GithubActivity from "./about/GithubActivity";

type Role = {
  title: string;
  company: string;
  period: string;
  workType: "Remote" | "On-site" | "Hybrid";
  location: string;
  summary: string;
  isCurrent?: boolean;
};

const experience: Role[] = [
  {
    title: "Software Engineer",
    company: "Doonkhav Pvt Ltd",
    period: "Jul 2025 — Present",
    workType: "On-site",
    location: "Kotli, AJK",
    summary:
      "Build frontend, backend, and mobile features across three concurrent production SaaS platforms — education, social commerce, and delivery/e-commerce. Ship React / Next.js interfaces and role-based dashboards wired to NestJS REST APIs and PostgreSQL, develop cross-platform mobile screens in React Native and Flutter, and contribute to API design, schema changes, and Docker deployments to AWS EC2.",
    isCurrent: true,
  },
  {
    title: "MERN Stack Developer",
    company: "Logicexer Pvt Ltd",
    period: "Jun 2024 — Jun 2025",
    workType: "On-site",
    location: "Kotli, AJK",
    summary:
      "Built full-stack features on the MERN stack for internal tools and client-facing products — designing REST APIs and MongoDB data models that powered core functionality. Led a partial migration to NestJS and PostgreSQL, gaining production experience across both stacks, and took part in sprint planning, code review, and release cycles.",
  },
  {
    title: "Frontend & React Native Developer",
    company: "Logicexer Pvt Ltd",
    period: "Jun 2023 — May 2024",
    workType: "On-site",
    location: "Kotli, AJK",
    summary:
      "Built responsive React interfaces and cross-platform React Native (Expo) screens for company products. Implemented reusable UI components, navigation, and state management across web and mobile, and integrated backend REST APIs into both clients.",
  },
  {
    title: "Frontend Developer — Intern",
    company: "Logicexer Pvt Ltd",
    period: "Feb 2023 — May 2023",
    workType: "On-site",
    location: "Kotli, AJK",
    summary:
      "First step into shipping production code. Fixed frontend bugs and built small React UI components on a live production codebase, and learned Git workflow, code review, and agile sprint practices within a real engineering team.",
  },
];

type Stat = { label: string; value: string; icon: LucideIcon };

const stats: Stat[] = [
  { label: "Years building", value: "03+", icon: CalendarClock },
  { label: "Products shipped", value: "08+", icon: Globe },
  { label: "SaaS platforms", value: "03+", icon: Compass },
  { label: "Cups of chai", value: "∞", icon: Coffee },
];

const STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "NestJS",
  "React Native",
  "Flutter",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "CouchDB / PouchDB",
  "Docker",
  "AWS",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function PinIcon({ className }: { className?: string }) {
  return <MapPin aria-hidden className={className} size={11} strokeWidth={1.6} />;
}

export default function AboutPageContent() {
  return (
    <>
      {/* ── Hero — big framed portrait + identity ──────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-6 md:pt-14 md:pb-8">
          <div className="grid gap-9 md:grid-cols-[0.82fr_1.18fr] md:items-center md:gap-12">
            {/* Portrait */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="order-1 mx-auto w-full max-w-[260px] sm:max-w-[300px] md:max-w-none"
            >
              <TiltPortrait
                src="/img/msameer-image.png"
                alt="Muhammad Sameer — Full-Stack Software Engineer"
                priority
                sizes="(max-width: 768px) 300px, 380px"
                overlay={
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    <MapPin size={11} strokeWidth={1.8} />
                    Kotli, Azad Kashmir
                  </div>
                }
              />
            </motion.div>

            {/* Identity */}
            <div className="order-2">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Available for work
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
                className="mt-4 text-[38px] font-bold leading-[1.03] tracking-tight text-foreground sm:text-[52px]"
              >
                Muhammad{" "}
                <span className="bg-gradient-to-r from-accent to-accent-warm bg-clip-text text-transparent">
                  Sameer
                </span>
                .
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="mt-4 max-w-[540px] text-[15.5px] leading-[1.7] text-muted-foreground"
              >
                Software engineer from Kotli, Azad Kashmir — full-stack across
                React / Next.js, NestJS, and React Native, with{" "}
                <span className="font-semibold text-foreground">
                  3+ years
                </span>{" "}
                shipping production web and mobile products.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.26 }}
                className="mt-6 flex flex-wrap items-center gap-2.5"
              >
                <a
                  href="/msameer-cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
                >
                  <Eye size={14} strokeWidth={1.9} />
                  View resume
                </a>
                <a
                  href="/msameer-cv.pdf"
                  download="Muhammad-Sameer-Resume.pdf"
                  className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-5 text-[13px] font-medium text-foreground transition-colors duration-200 hover:border-accent/50 hover:bg-card"
                >
                  <Download
                    size={14}
                    strokeWidth={1.9}
                    className="transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                  Download
                </a>
              </motion.div>

              {/* Core stack pills */}
              <motion.ul
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.34 }}
                className="mt-7 flex flex-wrap gap-2"
              >
                {STACK.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-border bg-card/60 px-2.5 py-1 text-[12px] text-muted-foreground"
                  >
                    {s}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Story + Numbers ─────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
          <SectionHead
            title="The short story"
            description="Where I'm from, what I work on, and the path that got me here."
          />

          {/* Stats — accent-lit cards */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  {...fadeUp(0.04 * i)}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-accent/40 hover:shadow-[0_18px_44px_-20px_rgb(var(--bg-teal)/0.5)]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                      <Icon size={15} strokeWidth={1.8} />
                    </span>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                  <p className="mt-4 bg-gradient-to-br from-accent to-accent-warm bg-clip-text text-[30px] font-bold leading-none tracking-tight tabular-nums text-transparent sm:text-[32px]">
                    {s.value}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Story prose */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <motion.div {...fadeUp(0)} className="space-y-5 text-[15.5px] leading-[1.75] text-foreground/85">
              <p>
                I&apos;m Sameer — a software engineer from Kotli, Azad
                Kashmir. I build full-stack production systems across a
                handful of domains — education / LMS, social commerce, and
                delivery / e-commerce — from multi-tenant SaaS platforms to
                the mobile apps that sit on top of them.
              </p>
              <p>
                My core stack is{" "}
                <span className="font-medium text-foreground">Next.js + React</span>{" "}
                on the frontend and{" "}
                <span className="font-medium text-foreground">Node.js / NestJS</span>{" "}
                for APIs, with{" "}
                <span className="font-medium text-foreground">React Native &amp; Flutter</span>{" "}
                whenever a product needs to reach mobile. TypeScript
                end-to-end, Docker on AWS EC2, and a strong bias for
                whatever the problem actually needs — not whatever&apos;s
                trendy.
              </p>
              <p className="text-muted-foreground">
                Currently a Software Engineer at Doonkhav, building across
                three concurrent SaaS platforms. Previously at Logicexer —
                from frontend intern to MERN and NestJS developer. BSc
                Software Engineering from the University of Kotli.
              </p>
            </motion.div>

            {/* Philosophy callout — accent-tinted highlight */}
            <motion.div
              {...fadeUp(0.05)}
              className="relative overflow-hidden rounded-2xl border border-accent/25 p-6 sm:p-7"
              style={{ background: "rgb(var(--bg-teal) / 0.06)" }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, rgb(var(--bg-teal) / 0.28), transparent 70%)",
                }}
              />
              <p className="relative text-[11px] uppercase tracking-[0.2em] text-accent">
                Philosophy
              </p>
              <p className="relative mt-4 text-[17px] font-medium leading-[1.65] text-foreground/90">
                &ldquo;The valley shaped how I build. Offline-first isn&apos;t
                a buzzword to me — it&apos;s a rule. The CouchDB / PouchDB
                sync flows I&apos;ve shipped keep a point-of-sale running
                through dead zones without losing a single order.&rdquo;
              </p>
              <p className="relative mt-5 text-[13px] text-muted-foreground">
                Offline-first · Graceful degradation · Typed end-to-end
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How I work — SDLC cycle ─────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
          <SectionHead
            title="How I work"
            description="A loop, not a checklist. Software is never done — it just gets sharper with each pass."
          />
          <div className="mt-10">
            <SDLCCycle />
          </div>
        </div>
      </section>

      {/* ── On GitHub ───────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
          <SectionHead
            title="On GitHub"
            description="Most of my work is private — here's the shape of it, and an open door to a code walkthrough."
          />
          <div className="mt-8">
            <GithubActivity />
          </div>
        </div>
      </section>

      {/* ── Experience — card timeline ───────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
          <SectionHead
            title="Experience"
            description="The places I've shown up. Newest first."
          />

          <div className="relative mt-8 space-y-4 sm:pl-8">
            {/* Rail (desktop) */}
            <span className="absolute top-3 bottom-3 left-[7px] hidden w-px bg-border sm:block" />

            {experience.map((role, i) => (
              <motion.div
                key={`${role.title}-${role.company}`}
                {...fadeUp(0.05 + 0.05 * i)}
                className="relative"
              >
                {/* Dot on the rail */}
                <span
                  className={`absolute top-6 -left-[26px] hidden h-[9px] w-[9px] rounded-full sm:block ${
                    role.isCurrent
                      ? "bg-accent ring-4 ring-accent/15"
                      : "border border-foreground/40 bg-background"
                  }`}
                />

                <div className="rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-accent/40 hover:shadow-[0_18px_44px_-22px_rgb(var(--bg-teal)/0.5)] sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h3
                        className={`text-[17px] font-semibold tracking-tight sm:text-[18px] ${
                          role.isCurrent ? "text-foreground" : "text-foreground/90"
                        }`}
                      >
                        {role.title}
                      </h3>
                      {role.isCurrent && (
                        <span className="inline-flex h-5 items-center rounded-full bg-accent px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-foreground">
                          Now
                        </span>
                      )}
                    </div>
                    <span className="text-[12.5px] tabular-nums text-muted-foreground">
                      {role.period}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11.5px] uppercase tracking-[0.12em] text-muted-foreground/80">
                    <span className="font-medium text-accent/90">{role.company}</span>
                    <span className="h-2.5 w-px bg-border" />
                    <span>{role.workType}</span>
                    <span className="h-2.5 w-px bg-border" />
                    <span className="inline-flex items-center gap-1.5">
                      <PinIcon className="text-muted-foreground" />
                      {role.location}
                    </span>
                  </div>

                  <p className="mt-3.5 text-[14.5px] leading-[1.7] text-foreground/85">
                    {role.summary}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outside of work + CTA ─────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-16">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            {/* Outside of work */}
            <motion.div
              {...fadeUp(0)}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Outside of work
                </p>
                <p className="text-[11px] text-muted-foreground/70">
                  the unofficial bio
                </p>
              </div>

              <div className="mt-4 space-y-4 text-[15px] leading-[1.75] text-foreground/85">
                <p>
                  When the editor closes, you&apos;ll find me{" "}
                  <span className="font-semibold text-foreground">reading</span>{" "}
                  more than I write,{" "}
                  <span className="font-semibold text-foreground">walking long distances</span>{" "}
                  at no particular pace, and brewing{" "}
                  <span className="font-semibold text-foreground">chai</span>{" "}
                  for anyone who shows up at the door — there&apos;s always one
                  extra cup.
                </p>
                <p>
                  I&apos;m a{" "}
                  <span className="font-semibold text-foreground">stubborn collector of half-finished side projects</span>{" "}
                  and a very loud{" "}
                  <span className="font-semibold text-foreground">cheerleader for self-taught devs</span>{" "}
                  learning to code from a place that doesn&apos;t make it
                  easy.
                </p>
              </div>
            </motion.div>

            {/* CTA — aurora-lit */}
            <motion.div
              {...fadeUp(0.05)}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-accent/25 bg-card p-6 sm:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, rgb(var(--bg-teal) / 0.28), transparent 70%)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, rgb(var(--bg-amber) / 0.22), transparent 70%)",
                }}
              />

              <div className="relative">
                <p className="text-[11px] uppercase tracking-[0.18em] text-accent">
                  Let&apos;s talk
                </p>
                <h2 className="mt-3 text-[22px] font-bold leading-tight tracking-tight text-foreground sm:text-[25px]">
                  Got something to build?
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                  Whether it&apos;s a fresh idea, a stuck project, or a
                  long-term partnership — I&apos;d love to hear about it.
                </p>
              </div>

              <div className="relative mt-6 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/contact"
                  className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
                >
                  Get in touch
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/projects"
                  className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-5 text-[13px] font-medium text-foreground transition-colors duration-200 hover:border-accent/50 hover:bg-card"
                >
                  See my work
                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
