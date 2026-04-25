"use client";

import { motion } from "framer-motion";

/**
 * Section header — Abhinay's pattern:
 * heading + description on the left, a horizontal hairline filling the
 * right column, vertically centered.
 */
export default function SectionHead({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_1fr] sm:items-center sm:gap-10">
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-[26px] font-bold tracking-tight text-foreground"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.p>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="hidden h-px origin-left bg-border/70 sm:block"
      />
    </div>
  );
}
