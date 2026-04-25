"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const update = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const handleHome = () =>
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });

  return (
    <motion.button
      type="button"
      onClick={handleHome}
      aria-label="Back to top"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-6 bottom-6 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition-colors hover:border-foreground hover:bg-foreground hover:text-background sm:right-8 sm:bottom-8"
    >
      <ArrowUp size={18} strokeWidth={2} />
    </motion.button>
  );
}
