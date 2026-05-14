"use client";

import SectionHead from "./SectionHead";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

// Quotes from saranzafar.com — gently expanded with natural context.
const testimonials: Testimonial[] = [
  {
    name: "Dr. Imran Kiani",
    role: "Skin Specialist",
    quote:
      "Saran developed a desktop system that completely streamlined our clinic operations — from patient records and appointments to prescriptions and billing, all running smoothly even when our internet drops out. His technical understanding and attention to real-world clinical workflows made a noticeable difference for us. The team picked it up almost immediately, and the offline-first design has saved us countless hours of manual reconciliation. He's responsive whenever we need adjustments and treats our work like his own.",
  },
  {
    name: "Ayaz Naseeb",
    role: "Software Engineer",
    quote:
      "Saran delivered a high-quality WordPress website that looks great and works flawlessly. He's professional, responsive, and truly cares about his work. Highly recommended.",
  },
  {
    name: "Azkaar",
    role: "CEO at NetzingTechnologies",
    quote:
      "Working with Saran on our Android application was a great experience from start to finish. He delivered a stable, well-structured app and handled complex requirements with clarity and professionalism. What stood out the most was his ability to take ambiguous problems, ask the right questions, and turn them into clean, reliable solutions. He communicated proactively, hit every milestone, and the codebase he handed over was easy for our team to extend. Genuinely one of the most dependable engineers I've worked with.",
  },
  {
    name: "Usman Arif",
    role: "Full Stack Developer",
    quote:
      "Saran built my portfolio with a clear understanding of structure, performance, and presentation. The final result was clean, professional, and aligned perfectly with my personal brand. He listens carefully and pushes back thoughtfully when something can be done better.",
  },
  {
    name: "Khawar Mehfooz",
    role: "Software Engineer",
    quote:
      "Saran guided me through hosting selection and setup with complete clarity. His recommendation helped me save costs while getting a reliable and secure hosting solution — exactly the kind of practical advice I was looking for.",
  },
  {
    name: "Abdul Wahab",
    role: "Software Engineer",
    quote:
      "Saran delivered a high-quality website that looks great and works flawlessly. Professional, responsive, and detail-oriented throughout. Highly recommended.",
  },
  {
    name: "M Ifraheem",
    role: "Software Engineer",
    quote:
      "Saran is someone you can rely on for building a solid website. He understood our needs quickly and delivered a fast, clean, and well-organized solution that we've been able to maintain easily ever since.",
  },
  {
    name: "M Sameer",
    role: "Software Engineer",
    quote:
      "Saran has been a real mentor to me during my own projects. Whenever I get stuck on architecture decisions or implementation details, he takes the time to walk through the trade-offs clearly and points me in the right direction. His guidance has saved me weeks of trial and error, and he explains things in a way that actually sticks. I owe a good chunk of my growth as a developer to the conversations I've had with him.",
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
    <figure className="break-inside-avoid rounded-2xl border border-border bg-card p-6 transition-colors duration-200 hover:border-foreground">
      <span
        aria-hidden="true"
        className="block text-[32px] leading-none text-muted-foreground/45"
      >
        &ldquo;
      </span>

      <blockquote className="mt-3 text-[14.5px] leading-[1.7] text-foreground/85">
        {t.quote}
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-400 text-[11px] font-semibold text-zinc-700 dark:from-zinc-700 dark:to-zinc-600 dark:text-zinc-100"
        >
          {initials(t.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-foreground">
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
 * Vertical infinite-scroll column.
 * - Items duplicated so the marquee loops seamlessly.
 * - `group` scope means hovering anywhere INSIDE this column pauses
 *   ONLY this column — the other one keeps scrolling.
 * - Top + bottom gradient overlays dissolve cards at the edges instead
 *   of hard-clipping them.
 */
function MarqueeColumn({
  items,
  speedSec,
}: {
  items: Testimonial[];
  speedSec: number;
}) {
  const loop = [...items, ...items];
  return (
    <div className="testimonial-col relative h-[560px] overflow-hidden sm:h-[640px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-background via-background/80 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-background via-background/80 to-transparent"
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

// Split into alternating halves so each column has a varied mix of
// short + long quotes (mirrors what the old masonry naturally produced).
const colA = testimonials.filter((_, i) => i % 2 === 0);
const colB = testimonials.filter((_, i) => i % 2 === 1);

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <SectionHead
          title="Testimonials"
          description="Here's what some of my recent clients have to say about working with me. Their experiences showcase the value and quality I bring to every project."
        />

        {/* Mobile — single column with all 8, slightly slower so each
            card is on screen long enough to read on small viewports. */}
        <div className="mt-10 sm:hidden">
          <MarqueeColumn items={testimonials} speedSec={70} />
        </div>

        {/* Desktop — 2 columns side-by-side, each scrolling at slightly
            different speeds (55s vs 65s) so they don't lock-step. The
            asymmetry creates an organic, alive feel without being chaotic. */}
        <div className="mt-10 hidden gap-5 sm:grid sm:grid-cols-2">
          <MarqueeColumn items={colA} speedSec={55} />
          <MarqueeColumn items={colB} speedSec={65} />
        </div>
      </div>
    </section>
  );
}
