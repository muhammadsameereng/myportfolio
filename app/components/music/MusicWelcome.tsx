"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMusic } from "./MusicProvider";
import { pickMessage } from "./welcome-messages";

const SHOW_MS = 2200;

type ToastShape = {
  id: number;
  message: string;
};

/* ──────────────────────────────────────────────────────────────────────
 * MusicWelcome — small glass capsule that surfaces every time the
 * visitor toggles play/pause. Sits just above the bottom dock.
 *
 * - Slides UP from below into view, holds ~2.2s, slides DOWN to exit.
 * - Pure text. No icon, no chrome, no progress bar.
 * - Rapid clicks: capsule stays mounted, only the inner text
 *   cross-fades between picks; the dismiss timer resets each time.
 * - Tap to dismiss early.
 * ────────────────────────────────────────────────────────────────────── */
export default function MusicWelcome() {
  const m = useMusic();
  const [toast, setToast] = useState<ToastShape | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (m.actionSeq === 0 || !m.lastAction) return;
    setToast({
      id: m.actionSeq,
      message: pickMessage(m.lastAction),
    });
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, SHOW_MS);
  }, [m.actionSeq, m.lastAction]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const dismiss = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setToast(null);
  };

  return (
    <AnimatePresence>
      {toast ? (
        <motion.button
          type="button"
          onClick={dismiss}
          aria-live="polite"
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 32, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 30,
            mass: 0.7,
          }}
          className="fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 cursor-pointer sm:bottom-24"
        >
          <div className="rounded-full border border-border/25 bg-background/80 px-4 py-2 shadow-[0_8px_22px_-14px_rgba(0,0,0,0.16)] backdrop-blur-xl backdrop-saturate-150">
            <div className="relative h-[14px] min-w-[180px] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={toast.id}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 whitespace-nowrap text-center text-[12.5px] leading-[14px] text-foreground"
                >
                  {toast.message}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
