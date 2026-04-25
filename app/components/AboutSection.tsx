"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Role = {
  title: string;
  company: string;
  period: string;
  workType: "Remote" | "On-site" | "Hybrid";
  location: string;
  summary: string;
  isCurrent?: boolean;
};

// Real experience from saranzafar's LinkedIn, newest-first.
const experience: Role[] = [
  {
    title: "Software Engineer",
    company: "Voltek",
    period: "Apr 2026 — Present",
    workType: "Remote",
    location: "United States",
    summary:
      "building scalable web solutions — nestjs, next.js, react.js, typescript.",
    isCurrent: true,
  },
  {
    title: "Full Stack Engineer",
    company: "Logicexer",
    period: "Aug 2024 — Apr 2026",
    workType: "On-site",
    location: "Kotli, Azad Jammu and Kashmir",
    summary:
      "software development, team management. promoted from intern after two months.",
  },
  {
    title: "Summer Intern",
    company: "Logicexer",
    period: "Jul 2024 — Aug 2024",
    workType: "On-site",
    location: "Kotli, Azad Jammu and Kashmir",
    summary: "mern stack. desktop apps, web apps, the first real codebases.",
  },
];

// Small counters that mirror git blame's --stat footer.
const stats = [
  { label: "years", value: "02+" },
  { label: "clients", value: "25+" },
  { label: "commits", value: "~10k" },
  { label: "coffee", value: "∞" },
];

/** Small hand-sized pin icon — line art, inherits text color. */
function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 1.2 C 3.6 1.2 2.2 2.9 2.2 4.7 C 2.2 7.2 6 10.8 6 10.8 C 6 10.8 9.8 7.2 9.8 4.7 C 9.8 2.9 8.4 1.2 6 1.2 Z" />
      <circle cx="6" cy="4.7" r="1.3" />
    </svg>
  );
}

/** Reusable micro-label: short hairline + mono uppercase text. */
function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
      <span className="h-px w-6 bg-foreground" />
      <span>{children}</span>
    </div>
  );
}

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative pt-12 pb-24" ref={ref}>
      {/* Structural vertical rails */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-6xl">
        <div className="absolute top-0 bottom-0 left-6 w-px bg-border/40 sm:left-8" />
        <div className="absolute top-0 bottom-0 right-6 w-px bg-border/40 sm:right-8" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="h-px w-6 bg-border" />
          <span>readme.md</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 text-[32px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[40px] lg:text-[44px]"
        >
          About<span className="text-muted">.</span>
        </motion.h2>

        {/* Two-column: description (left) + experience (right) */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* LEFT — description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-5 text-[16px] leading-[1.7] text-foreground/85">
              <p>
                Software engineer from Kashmir. Backend-focused — mostly
                NestJS and TypeScript, with reach into mobile and the
                frontend.
              </p>
              <p>
                I like boring tech applied to hard problems. Good code reads
                like English. Good systems are quiet. Good clients become
                friends.
              </p>
              <p className="text-muted-foreground">
                Currently shipping scalable web work remotely from the valley.
                Happy to talk about APIs, backends, and the quiet parts of
                software.
              </p>
            </div>

            {/* Stats — single row, hairline dividers between cells */}
            <div className="mt-10 border-t border-border/60 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="grid grid-cols-2 items-stretch gap-y-6 sm:flex"
              >
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`group sm:flex-1 ${
                      i > 0 ? "sm:border-l sm:border-border/60 sm:pl-4" : ""
                    } ${i < stats.length - 1 ? "sm:pr-4" : ""}`}
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                      {s.label}
                    </div>
                    <div className="mt-2 text-[26px] font-semibold leading-none tracking-tight tabular-nums text-foreground">
                      {s.value}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT — experience */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SideLabel>experience</SideLabel>

            {/* Timeline rail + roles */}
            <div className="relative mt-6 pl-7">
              {/* vertical rail */}
              <span className="absolute top-[10px] bottom-[10px] left-[3px] w-px bg-border/70" />

              <div className="space-y-8">
                {experience.map((role, i) => (
                  <motion.div
                    key={`${role.title}-${role.company}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + 0.1 * i }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <span
                      className={`absolute -left-7 top-[6px] h-[7px] w-[7px] rounded-full ${
                        role.isCurrent
                          ? "bg-foreground ring-2 ring-background"
                          : "border border-foreground/50 bg-background"
                      }`}
                    />

                    {/* Title + "current" tag */}
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h3
                        className={`text-[17px] font-semibold tracking-tight ${
                          role.isCurrent ? "text-foreground" : "text-foreground/85"
                        }`}
                      >
                        {role.title}
                      </h3>
                      {role.isCurrent && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground">
                          · now
                        </span>
                      )}
                    </div>

                    {/* Company · period */}
                    <div className="mt-1.5 flex flex-wrap items-center font-mono text-[12px] text-muted-foreground">
                      <span className="text-foreground/85">{role.company}</span>
                      <span className="mx-2 text-muted-foreground/70">·</span>
                      <span>{role.period}</span>
                    </div>

                    {/* Work type · location (with pin icon before location) */}
                    <div className="mt-1 flex items-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/70">
                      <span>{role.workType}</span>
                      <span className="mx-2 text-muted-foreground/70">·</span>
                      <PinIcon className="mr-1.5 h-[11px] w-[11px] text-muted-foreground" />
                      <span>{role.location}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
