"use client";

import { motion } from "framer-motion";
import { SOCIALS } from "./socials";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-t border-border/40"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        {/* Left — logo + copyright */}
        <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-muted-foreground">
          <span className="flex items-center gap-1.5 text-foreground">
            <span aria-hidden="true">✦</span>
            <span className="font-semibold">saranzafar</span>
          </span>
          <span>© {new Date().getFullYear()} Saran Zafar. All rights reserved.</span>
        </div>

        {/* Right — socials */}
        <div className="flex items-center gap-4">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom strip — handcrafted line */}
      <div className="border-t border-border/40">
        <p className="mx-auto max-w-5xl px-6 py-4 text-center text-[12px] text-muted-foreground">
          Made with{" "}
          <span aria-label="love" role="img" className="text-rose-500">
            ❤️
          </span>{" "}
          in Azad Kashmir, Pakistan
        </p>
      </div>
    </motion.footer>
  );
}
