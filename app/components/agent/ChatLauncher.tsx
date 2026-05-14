"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy-load the panel — keeps framer-motion's chat-side code out of the
// initial bundle. The launcher pill itself is small and ships eagerly so
// the visitor sees the entry point on first paint.
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Caret" : "Ask Caret"}
        aria-expanded={open}
        aria-haspopup="dialog"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        className="group fixed left-6 bottom-6 z-40 inline-flex h-11 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-foreground pl-3.5 pr-4 text-[13px] font-medium text-background shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)] transition-opacity duration-200 hover:opacity-95 sm:left-8 sm:bottom-8"
      >
        {/* Animated sheen — sits underneath the icon + label via z-index. */}
        {!reduceMotion && <span aria-hidden className="caret-launcher-sheen" />}

        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "sparkles"}
            initial={
              reduceMotion ? { opacity: 0 } : { rotate: -45, opacity: 0 }
            }
            animate={reduceMotion ? { opacity: 1 } : { rotate: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { rotate: 45, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 flex items-center justify-center"
          >
            {open ? (
              <X size={14} strokeWidth={2.2} />
            ) : (
              <Sparkles size={14} strokeWidth={2} />
            )}
          </motion.span>
        </AnimatePresence>
        <span className="relative z-10">{open ? "Close" : "Ask Caret"}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <ChatPanel
            onClose={() => setOpen(false)}
            returnFocusRef={buttonRef}
          />
        )}
      </AnimatePresence>
    </>
  );
}
