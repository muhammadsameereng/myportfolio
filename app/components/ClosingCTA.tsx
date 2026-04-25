"use client";

import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

export default function ClosingCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="relative px-6 pt-24 pb-16" ref={ref}>
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-5xl">
        <div className="absolute top-0 bottom-0 left-6 w-px bg-border/40 sm:left-8" />
        <div className="absolute top-0 bottom-0 right-6 w-px bg-border/40 sm:right-8" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-10 bg-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            /contact
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Got an idea worth
          <br />
          <span className="text-muted">building properly?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground"
        >
          I take on a small number of projects at a time — the kind where the
          work is worth doing carefully. If that sounds like yours, let&apos;s
          talk.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="/contact"
            className="group inline-flex h-11 items-center gap-3 bg-accent px-6 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Start a conversation
            <ArrowUpRight
              size={15}
              className="transition-transform duration-200 group-hover:-translate-y-[1px] group-hover:translate-x-[1px]"
            />
          </a>
          <a
            href="mailto:saran.development@gmail.com"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            saran.development@gmail.com
          </a>
        </motion.div>

        {/* Footer — single hairline, inline items separated by verticals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-20 flex items-center gap-4 border-t border-border/60 pt-5 font-mono text-[11px] text-muted-foreground"
        >
          <span>© {new Date().getFullYear()} Saran Zafar</span>
          <span className="h-3 w-px bg-border" />
          <span>Kashmir</span>
          <span className="ml-auto">available for work</span>
        </motion.div>
      </div>
    </section>
  );
}
