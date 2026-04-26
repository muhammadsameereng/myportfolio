"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Coffee,
  Globe,
  MapPin,
  Server,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHead from "./SectionHead";

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
    company: "VoltekIT",
    period: "Present",
    workType: "Remote",
    location: "Remote",
    summary:
      "Building scalable web products end-to-end — NestJS REST APIs, multi-tenant SaaS architecture, and Next.js + React frontends. Working across the stack on the systems that power VoltekIT's clients, with TypeScript and AWS EC2 as the daily drivers.",
    isCurrent: true,
  },
  {
    title: "Full Stack Software Engineer",
    company: "Logicexer Pvt Ltd",
    period: "Aug 2024 — Present",
    workType: "On-site",
    location: "Kotli, Azad Kashmir",
    summary:
      "Promoted from intern. Engineered 3 offline-first desktop systems (Electron + CouchDB/PouchDB) deployed across clinics, retail, and food service businesses — zero data loss during network outages via bidirectional sync. Architected NestJS REST APIs with modular service design and TypeScript DTO validation, cutting runtime errors in production to zero. Built and maintained 5+ full-stack web apps with Next.js + React. Reduced deployment time by ~60% through GitLab CI/CD pipelines on AWS EC2.",
  },
  {
    title: "Software Engineering Intern",
    company: "Logicexer Pvt Ltd",
    period: "Jul 2024 — Aug 2024",
    workType: "On-site",
    location: "Kotli, Azad Kashmir",
    summary:
      "Built and tested 4+ desktop application features using Electron.js, React, and TypeScript, contributing to a live business management system used by real clients. Resolved 20+ bug reports across CouchDB/PouchDB sync workflows. Supported deployment of 3 WordPress projects.",
  },
];

type Stat = { label: string; value: string; icon: LucideIcon };

const stats: Stat[] = [
  { label: "Years building", value: "02+", icon: CalendarClock },
  { label: "Live websites", value: "16+", icon: Globe },
  { label: "Enterprise systems", value: "03", icon: Server },
  { label: "Cups of chai", value: "∞", icon: Coffee },
];

const principles = [
  {
    title: "Boring tools, hard problems.",
    body: "Reach for the proven thing. Spend the novelty budget where it actually pays — on the part that's hard about the problem, not the framework.",
  },
  {
    title: "Code that reads like English.",
    body: "Future-me is the most common reader. So is the next engineer to touch this. Naming, shape, and intent matter more than cleverness.",
  },
  {
    title: "Trust earned slowly.",
    body: "By showing up. By doing what was promised. By being honest about what didn't go to plan. The slow way is the only way that lasts.",
  },
  {
    title: "Calm software, every time.",
    body: "Quiet by default. Loud only when something needs the human's attention. Most of the value is in what doesn't ask to be noticed.",
  },
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
      {/* ── Hero / intro ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 pt-14 pb-12 md:grid-cols-[auto_1fr] md:gap-12 md:pt-20 md:pb-12">
          {/* Profile chip — same composition as the home hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative inline-block h-[150px] w-[160px]"
          >
            <div className="absolute bottom-0 left-0 right-0 h-[105px] rounded-2xl border border-foreground/20 bg-zinc-100 dark:bg-zinc-800" />
            <Image
              src="/img/saranzafar-image.png"
              alt="Saran Zafar"
              // True intrinsic dimensions of the source PNG (300×291).
              width={300}
              height={291}
              priority
              fetchPriority="high"
              sizes="160px"
              style={{ height: "150px", width: "auto" }}
              className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 select-none"
            />
          </motion.div>

          {/* Identity */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[12.5px] uppercase tracking-[0.22em] text-muted-foreground"
            >
              About me
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
              className="mt-3 text-[36px] font-bold leading-[1.05] tracking-tight text-foreground sm:text-[48px]"
            >
              Saran Zafar.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-3 max-w-[520px] text-[15.5px] font-semibold leading-snug text-foreground"
            >
              Software engineer from Kashmir — full-stack across backend
              and frontend, with 2+ years shipping production systems.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                <PinIcon /> Kotli, Azad Kashmir, Pakistan
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Ready to work
              </span>
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <SectionHead
            title="The short story"
            description="Where I'm from, what I work on, and the path that got me here."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <motion.div {...fadeUp(0)} className="space-y-5 text-[15.5px] leading-[1.75] text-foreground/85">
              <p>
                I&apos;m Saran — a software engineer from Kotli, in Azad
                Kashmir. I build full-stack production systems for
                healthcare, retail, and e-commerce businesses, with live
                websites and enterprise-grade desktop systems running in
                real-world environments.
              </p>
              <p>
                My core stack is{" "}
                <span className="font-medium text-foreground">NestJS</span>{" "}
                for backend APIs and{" "}
                <span className="font-medium text-foreground">Next.js + React</span>{" "}
                for the web. I work in TypeScript end-to-end, deploy with
                Docker on AWS EC2, and reach for whatever the problem
                actually needs — not whatever&apos;s trendy.
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.05)} className="space-y-5 text-[15.5px] leading-[1.75] text-foreground/85">
              <p>
                The valley shaped how I build. The internet here is good
                most days, and gone for stretches that nobody can predict.
                So offline-first isn&apos;t a buzzword to me — it&apos;s a
                rule. The Electron + CouchDB/PouchDB systems I&apos;ve
                shipped have run for months in clinics and shops without a
                single lost write.
              </p>
              <p className="text-muted-foreground">
                Currently a Full-Stack Engineer at Logicexer — promoted from
                intern in 2024. BSc Software Engineering from the University
                of Kotli. Always up to talk about products, teams, and the
                quiet parts of software.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Numbers ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <SectionHead
            title="By the numbers"
            description="A few honest counters from the last couple of years of work."
          />

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  {...fadeUp(0.04 * i)}
                  whileHover={{ y: -3 }}
                  className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
                >
                  {/* Header row — small icon tile + label, same pattern
                      used by Skills + Contact rows for a consistent feel. */}
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/[0.05] text-foreground/75 transition-colors group-hover:bg-foreground/[0.08] group-hover:text-foreground">
                      <Icon size={15} strokeWidth={1.8} />
                    </span>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {s.label}
                    </p>
                  </div>

                  {/* Value — the headline number */}
                  <p className="mt-4 text-[28px] font-semibold leading-none tracking-tight tabular-nums text-foreground sm:text-[30px]">
                    {s.value}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Principles ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <SectionHead
            title="How I work"
            description="A few quiet principles I keep coming back to. Not rules — habits."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp(0.04 * i)}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30"
              >
                <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[1.7] text-muted-foreground">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <SectionHead
            title="Experience"
            description="The places I've shown up. Newest first."
          />

          {/* Timeline */}
          <div className="relative mt-10 pl-7 sm:pl-9">
            <span className="absolute top-2 bottom-2 left-[3px] w-px bg-border sm:left-[7px]" />

            <div className="space-y-9">
              {experience.map((role, i) => (
                <motion.div
                  key={`${role.title}-${role.company}`}
                  {...fadeUp(0.05 + 0.05 * i)}
                  className="relative"
                >
                  <span
                    className={`absolute top-[6px] -left-7 h-[8px] w-[8px] rounded-full sm:-left-9 ${
                      role.isCurrent
                        ? "bg-foreground ring-2 ring-background"
                        : "border border-foreground/45 bg-background"
                    }`}
                  />

                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3
                      className={`text-[17px] font-semibold tracking-tight sm:text-[18px] ${
                        role.isCurrent ? "text-foreground" : "text-foreground/85"
                      }`}
                    >
                      {role.title}
                    </h3>
                    {role.isCurrent && (
                      <span className="inline-flex h-5 items-center rounded-full bg-foreground px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-background">
                        Now
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center text-[13px] text-muted-foreground">
                    <span className="text-foreground/85">{role.company}</span>
                    <span className="mx-2 text-muted-foreground/60">·</span>
                    <span>{role.period}</span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] uppercase tracking-[0.14em] text-muted-foreground/80">
                    <span>{role.workType}</span>
                    <span className="h-2.5 w-px bg-border" />
                    <span className="inline-flex items-center gap-1.5">
                      <PinIcon className="text-muted-foreground" />
                      {role.location}
                    </span>
                  </div>

                  <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.7] text-foreground/85">
                    {role.summary}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Outside of work ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <SectionHead
            title="Outside of work"
            description="The parts of me that don't show up on a CV."
          />

          <motion.div
            {...fadeUp(0)}
            className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="space-y-4 text-[15px] leading-[1.75] text-foreground/85">
              <p>
                Outside the editor, you&apos;ll find me reading more than I
                write, walking long distances at no particular pace, and
                making chai for anyone who shows up at the door.
              </p>
              <p>
                I&apos;m a slow learner of new languages, a stubborn collector
                of half-finished side projects, and a very loud cheerleader
                for anyone teaching themselves to code from a place that
                doesn&apos;t make it easy.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <motion.div
            {...fadeUp(0)}
            className="overflow-hidden rounded-2xl border border-border bg-card p-8 text-center sm:p-12"
          >
            <h2 className="text-[24px] font-bold tracking-tight text-foreground sm:text-[28px]">
              Got something to build?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
              Whether it&apos;s a fresh idea, a stuck project, or a long-term
              partnership — I&apos;d love to hear about it.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 text-[13.5px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
              >
                Get in touch
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/projects"
                className="group inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-6 text-[13.5px] font-medium text-foreground transition-colors duration-200 hover:border-foreground/50 hover:bg-card"
              >
                See my work
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
