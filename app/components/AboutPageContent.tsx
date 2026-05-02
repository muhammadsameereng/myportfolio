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
import Image from "next/image";
import Link from "next/link";
import SectionHead from "./SectionHead";
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
    company: "Voltekit",
    period: "2026 — Present",
    workType: "Remote",
    location: "Remote",
    summary:
      "Working in a hybrid software-engineer and full-stack developer role. Day to day means owning features end-to-end — shaping the data model, writing the backend, building the interface, and shipping the result to production. The focus is on scalable architecture, reliable APIs and clean, fast frontends, with TypeScript running through the whole stack.",
    isCurrent: true,
  },
  {
    title: "Full Stack Software Engineer",
    company: "Logicexer Pvt Ltd",
    period: "Aug 2024 — 2026",
    workType: "On-site",
    location: "AJK, Pakistan",
    summary:
      "Promoted from intern into a full-stack role that touched almost everything the team shipped — backend services and APIs, web applications, offline-capable desktop systems, content and marketing sites, and the deployment pipelines underneath all of it. The breadth meant moving comfortably between architecture decisions, day-to-day feature work and the quiet fixes that keep production calm.",
  },
  {
    title: "Software Engineering Intern",
    company: "Logicexer Pvt Ltd",
    period: "Jul 2024 — Aug 2024",
    workType: "On-site",
    location: "AJK, Pakistan",
    summary:
      "First step into shipping production code. Built features that real users would touch, fixed real bugs from real issue trackers, and learned how a working engineering team moves a product forward week to week.",
  },
];

type Stat = { label: string; value: string; icon: LucideIcon };

const stats: Stat[] = [
  { label: "Years building", value: "02+", icon: CalendarClock },
  { label: "Live websites", value: "17+", icon: Globe },
  { label: "Countries served", value: "05+", icon: Compass },
  { label: "Cups of chai", value: "∞", icon: Coffee },
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
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 pt-12 pb-6 md:grid-cols-[auto_1fr] md:gap-12 md:pt-16 md:pb-8">
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
              Software engineer from AJK, Pakistan — full-stack across
              backend and frontend, with 2+ years shipping production
              systems.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                <PinIcon /> AJK, Pakistan
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

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-6 flex flex-wrap items-center gap-2.5"
            >
              <a
                href="/saranzafar-cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
              >
                <Eye size={14} strokeWidth={1.9} />
                View resume
              </a>
              <a
                href="/saranzafar-cv.pdf"
                download="Saran-Zafar-Resume.pdf"
                className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-5 text-[13px] font-medium text-foreground transition-colors duration-200 hover:border-foreground/50 hover:bg-card"
              >
                <Download
                  size={14}
                  strokeWidth={1.9}
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                />
                Download
              </a>
            </motion.div>
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

          {/* Stats strip — sits high so the headline numbers anchor the
              section before the long-form copy starts. */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  {...fadeUp(0.04 * i)}
                  whileHover={{ y: -3 }}
                  className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/[0.05] text-foreground/75 transition-colors group-hover:bg-foreground/[0.08] group-hover:text-foreground">
                      <Icon size={15} strokeWidth={1.8} />
                    </span>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                  <p className="mt-4 text-[28px] font-semibold leading-none tracking-tight tabular-nums text-foreground sm:text-[30px]">
                    {s.value}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <motion.div {...fadeUp(0)} className="space-y-5 text-[15.5px] leading-[1.75] text-foreground/85">
              <p>
                I&apos;m Saran — a software engineer from AJK, Pakistan.
                I build full-stack production systems across a
                handful of industries — education, retail, healthcare,
                logistics and e-commerce — from multi-tenant SaaS platforms
                to marketing sites that have to load fast on a thin
                connection.
              </p>
              <p>
                My core stack is{" "}
                <span className="font-medium text-foreground">NestJS</span>{" "}
                for backend APIs and{" "}
                <span className="font-medium text-foreground">Next.js + React</span>{" "}
                for the web, with{" "}
                <span className="font-medium text-foreground">WordPress / WooCommerce</span>{" "}
                whenever a client needs to ship and edit a site themselves.
                TypeScript end-to-end, Docker on AWS, and a strong bias
                for whatever the problem actually needs — not whatever&apos;s
                trendy.
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
                Currently working as a Software Engineer and Backend
                Engineer at Voltekit. Previously a Full-Stack Developer at
                Logicexer, promoted from intern in 2024. BSc Software
                Engineering from the University of Kotli. Always up to
                talk about products, teams, and the quiet parts of
                software.
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
            description="A live snapshot of the streak, the longest run, and the year so far."
          />
          <div className="mt-8">
            <GithubActivity />
          </div>
        </div>
      </section>

      {/* ── Experience ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
          <SectionHead
            title="Experience"
            description="The places I've shown up. Newest first."
          />

          {/* Timeline */}
          <div className="relative mt-8 pl-7 sm:pl-9">
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

      {/* ── Outside of work + CTA ───────────────────────────────────
          Two-card bento row. Long form on the left, sharp call to action
          on the right — same bottom rhythm so the page exits as one
          confident beat instead of two trailing thoughts. */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            {/* Outside of work — paragraph prose, with the key
                personal touchstones (reading, walks, chai, etc.) bolded
                so they stand out as a scan-friendly read. */}
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
                  <span className="font-semibold text-foreground">slow learner of new languages</span>,
                  a stubborn collector of{" "}
                  <span className="font-semibold text-foreground">half-finished side projects</span>,
                  and a very loud{" "}
                  <span className="font-semibold text-foreground">cheerleader for self-taught devs</span>{" "}
                  learning to code from a place that doesn&apos;t make it
                  easy.
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              {...fadeUp(0.05)}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Let&apos;s talk
                </p>
                <h2 className="mt-3 text-[22px] font-bold leading-tight tracking-tight text-foreground sm:text-[24px]">
                  Got something to build?
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                  Whether it&apos;s a fresh idea, a stuck project, or a
                  long-term partnership — I&apos;d love to hear about it.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
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
                  className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-5 text-[13px] font-medium text-foreground transition-colors duration-200 hover:border-foreground/50 hover:bg-card"
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
