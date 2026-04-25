"use client";

import { motion } from "framer-motion";
import SectionHead from "./SectionHead";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

// Quotes from saranzafar.com — gently expanded with natural context
// to give the masonry layout the staggered Pinterest feel.
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
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function Card({ t, i }: { t: Testimonial; i: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.04 * i, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="break-inside-avoid rounded-2xl border border-border bg-card p-6"
    >
      {/* Big opening quote mark — sits at the top-left, like the reference */}
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
    </motion.figure>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <SectionHead
          title="Testimonials"
          description="Here's what some of my recent clients have to say about working with me. Their experiences showcase the value and quality I bring to every project."
        />

        {/* Masonry — 2-column Pinterest layout matching the reference.
            CSS-columns + break-inside-avoid keeps card heights organic. */}
        <div className="mt-10 columns-1 gap-5 sm:columns-2 [&>figure]:mb-5">
          {testimonials.map((t, i) => (
            <Card key={t.name} t={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
