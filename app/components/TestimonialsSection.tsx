"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

// Six verbatim quotes from saranzafar.com.
const testimonials: Testimonial[] = [
  {
    name: "Ayaz Naseeb",
    role: "Software Engineer",
    quote:
      "Saran delivered a high-quality WordPress website that looks great and works flawlessly. He's professional, responsive, and truly cares about his work. Highly recommended.",
  },
  {
    name: "Usman Arif",
    role: "Full Stack Developer",
    quote:
      "Saran built my portfolio with a clear understanding of structure, performance, and presentation. The final result was clean, professional, and aligned perfectly with my personal brand.",
  },
  {
    name: "Khawar Mehfooz",
    role: "Software Engineer",
    quote:
      "Saran guided me through hosting selection and setup with complete clarity. His recommendation helped me save costs while getting a reliable and secure hosting solution.",
  },
  {
    name: "Dr. Imran Kiani",
    role: "Skin Specialist",
    quote:
      "Saran developed a desktop system that streamlined our clinic operations. His technical understanding and attention to real-world workflows made a noticeable difference.",
  },
  {
    name: "M. Ifraheem",
    role: "Software Engineer",
    quote:
      "Saran is someone you can rely on for building a solid website. He understood our needs quickly and delivered a fast, clean, and well-organized solution.",
  },
  {
    name: "Azkaar",
    role: "CEO, Netzing Technologies",
    quote:
      "Working with Saran on our Android application was a great experience. He delivered a stable, well-structured app and handled complex requirements with clarity and professionalism.",
  },
];

// Duplicate so the marquee loops seamlessly.
const track = [...testimonials, ...testimonials];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="group relative flex min-h-[260px] w-[320px] shrink-0 flex-col border border-border/60 p-6 sm:w-[340px]">
      {/* Dashed hover border */}
      <span className="pointer-events-none absolute inset-0 border border-dashed border-foreground/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {/* Foreground entry tick */}
      <span className="absolute -top-px left-6 h-[3px] w-8 bg-foreground" />

      {/* Quote */}
      <blockquote className="flex-1 text-[15px] leading-[1.7] text-foreground/85">
        <span className="text-muted-foreground">&ldquo;</span>
        {t.quote}
        <span className="text-muted-foreground">&rdquo;</span>
      </blockquote>

      {/* Attribution */}
      <div className="mt-6 border-t border-border/60 pt-4">
        <p className="font-mono text-[13px] text-foreground">{t.name}</p>
        <p className="mt-1 font-mono text-[12px] text-muted-foreground">
          {t.role}
        </p>
      </div>
    </article>
  );
}

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [paused, setPaused] = useState(false);

  return (
    <section id="testimonials" className="relative pt-12 pb-24" ref={ref}>
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
          <span>quotes.log</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 text-[32px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[40px] lg:text-[44px]"
        >
          Testimonials<span className="text-muted">.</span>
        </motion.h2>

        {/* Infinite marquee rail — contained within the container.
            Edge mask fades cards in/out at the boundaries. Hover to pause. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="overflow-hidden py-1"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          }}
        >
          <div
            className="flex w-max gap-4"
            style={{
              animation: "marquee-x 60s linear infinite",
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {track.map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} t={t} />
            ))}
          </div>
        </motion.div>

        {/* Quiet hint — hover pauses the log */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="h-px w-8 bg-border" />
          <span>{paused ? "paused" : "hover to pause"}</span>
        </motion.div>
      </div>
    </section>
  );
}
