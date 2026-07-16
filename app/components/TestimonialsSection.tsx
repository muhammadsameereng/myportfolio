"use client";

import { Star } from "lucide-react";
import SectionHead from "./SectionHead";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

// TODO(sameer): still placeholder names — swap in real client/colleague
// quotes when you have them. The wording below reflects real strengths.
const testimonials: Testimonial[] = [
  {
    name: "Dr. Imran Kiani",
    role: "Clinic Owner",
    quote:
      "Sameer built us a system that keeps working even when the internet drops — nothing gets lost, and it syncs the moment we're back online. He clearly understood how we actually work and designed around it. Reliable, responsive, and easy to work with.",
  },
  {
    name: "Ayaz Naseeb",
    role: "Engineering Lead",
    quote:
      "He delivered a clean, well-structured NestJS backend our team could extend without fighting it — clear service boundaries, sensible APIs, solid data modeling. Professional throughout, and he genuinely cares about the craft.",
  },
  {
    name: "Usman Arif",
    role: "Startup Founder",
    quote:
      "Sameer took our product from a rough idea to a shipped app — data model, API, web, and mobile. Having one engineer own the whole stack kept everything coherent and moving fast. Clean, quick, and exactly what we needed.",
  },
  {
    name: "M Ifraheem",
    role: "Product Manager",
    quote:
      "He shipped our cross-platform mobile app on time and to a high standard — React Native and Flutter handled with the same care. Smooth screens, reliable flows, and real attention to the edge cases most people miss.",
  },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] || "") +
    (parts.length > 1 ? parts[parts.length - 1][0] : "")
  ).toUpperCase();
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-[0_20px_48px_-22px_rgb(var(--bg-teal)/0.5)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle, rgb(var(--bg-teal) / 0.3), transparent 70%)" }}
      />

      {/* Rating */}
      <div className="relative flex items-center gap-0.5 text-accent">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} strokeWidth={0} fill="currentColor" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="relative mt-3.5 text-[14px] leading-[1.7] text-foreground/85">
        <span aria-hidden="true" className="mr-1 align-[-0.35em] text-[24px] leading-none text-accent/60">
          &ldquo;
        </span>
        {t.quote}
      </blockquote>

      {/* Author */}
      <figcaption className="relative mt-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #0e7490, #d98a3d)" }}
        >
          {initials(t.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-foreground">
            {t.name}
          </p>
          <p className="truncate text-[11.5px] text-muted-foreground">
            {t.role}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Vertical infinite-scroll column (CSS `marquee-y`, transform-only).
 * Items are duplicated so the loop is seamless; hovering the column
 * pauses only that column. Top/bottom gradients dissolve the edges.
 */
function MarqueeColumn({ items, speedSec }: { items: Testimonial[]; speedSec: number }) {
  const loop = [...items, ...items];
  return (
    <div className="testimonial-col relative h-[540px] overflow-hidden sm:h-[600px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-background via-background/80 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-background via-background/80 to-transparent"
      />
      <div
        className="testimonial-track flex flex-col gap-5"
        style={{ "--ts-speed": `${speedSec}s` } as React.CSSProperties}
      >
        {loop.map((t, i) => (
          <Card key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

// Column B is rotated so the two columns never line up.
const colA = testimonials;
const colB = [...testimonials.slice(2), ...testimonials.slice(0, 2)];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <SectionHead
          title="Testimonials"
          description="A few words from people I've built for — across backend, mobile, and full-stack work."
        />

        {/* Mobile — one slow column */}
        <div className="mt-10 sm:hidden">
          <MarqueeColumn items={testimonials} speedSec={40} />
        </div>

        {/* Desktop — two columns at slightly different speeds */}
        <div className="mt-10 hidden gap-5 sm:grid sm:grid-cols-2">
          <MarqueeColumn items={colA} speedSec={38} />
          <MarqueeColumn items={colB} speedSec={46} />
        </div>
      </div>
    </section>
  );
}
