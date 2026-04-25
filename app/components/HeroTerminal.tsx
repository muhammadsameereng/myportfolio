"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface TerminalLine {
  type: "cmd" | "output" | "blank";
  text: string;
  color?: string;
}

interface Scene {
  lines: TerminalLine[];
  hold: number;
}

const scenes: Scene[] = [
  {
    hold: 5200,
    lines: [
      { type: "cmd", text: "whoami" },
      { type: "blank", text: "" },
      { type: "output", text: "saran zafar", color: "text-white" },
      { type: "output", text: "full-stack engineer", color: "text-white/75" },
      { type: "output", text: "kotli, kashmir · 33.5°N", color: "text-white/55" },
    ],
  },
  {
    hold: 5800,
    lines: [
      { type: "cmd", text: "cat stack.json" },
      { type: "blank", text: "" },
      { type: "output", text: "core   node · nest · next", color: "text-white/85" },
      { type: "output", text: "db     postgres · redis · sqlite", color: "text-white/75" },
      { type: "output", text: "infra  linux · docker · cloud", color: "text-white/75" },
      { type: "output", text: "now    learning rust, slowly", color: "text-white/55" },
    ],
  },
  {
    hold: 5600,
    lines: [
      { type: "cmd", text: "cat status" },
      { type: "blank", text: "" },
      { type: "output", text: "● available for new work", color: "text-white" },
      { type: "output", text: "open to: contract · part-time", color: "text-white/75" },
      { type: "output", text: "tz: PKT (UTC+5) — replies < 24h", color: "text-white/55" },
    ],
  },
  {
    hold: 6000,
    lines: [
      { type: "cmd", text: "ls ~/contact/" },
      { type: "blank", text: "" },
      { type: "output", text: "email     developers@voltekit.com", color: "text-white/85" },
      { type: "output", text: "github    @saranzafar", color: "text-white/75" },
      { type: "output", text: "linkedin  /in/saranzafar", color: "text-white/75" },
      { type: "output", text: "site      saranzafar.com", color: "text-white/75" },
    ],
  },
  {
    hold: 5400,
    lines: [
      { type: "cmd", text: "cat experience.txt" },
      { type: "blank", text: "" },
      { type: "output", text: "2+ yrs shipping in production", color: "text-white/85" },
      { type: "output", text: "25+ clients · indie + agency", color: "text-white/75" },
      { type: "output", text: "~10k commits · 40+ repos", color: "text-white/75" },
      { type: "output", text: "always on call for prod fires.", color: "text-white/55" },
    ],
  },
];

export default function HeroTerminal() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedCmd, setTypedCmd] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const scene = scenes[sceneIndex];

  useEffect(() => {
    const cmdLine = scene.lines.find((l) => l.type === "cmd");
    const cmdText = cmdLine?.text || "";

    if (isTyping) {
      if (typedCmd.length < cmdText.length) {
        // A relaxed, human typing rhythm. Pause longer after spaces and
        // punctuation so the line breathes instead of buzzing along.
        const justTyped = cmdText[typedCmd.length - 1];
        const base = 70 + Math.random() * 70;
        const pauseAfter = justTyped === " " ? 180 : /[.,/]/.test(justTyped || "") ? 220 : 0;
        const timer = setTimeout(() => {
          setTypedCmd(cmdText.slice(0, typedCmd.length + 1));
        }, base + pauseAfter);
        return () => clearTimeout(timer);
      } else {
        // Beat after the command lands, before output starts
        const timer = setTimeout(() => {
          setIsTyping(false);
          setVisibleLines(1);
        }, 450);
        return () => clearTimeout(timer);
      }
    } else {
      if (visibleLines < scene.lines.length) {
        const timer = setTimeout(() => {
          setVisibleLines((v) => v + 1);
        }, 220);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setSceneIndex((s) => (s + 1) % scenes.length);
          setVisibleLines(0);
          setTypedCmd("");
          setIsTyping(true);
        }, scene.hold);
        return () => clearTimeout(timer);
      }
    }
  }, [typedCmd, visibleLines, isTyping, scene]);

  return (
    <div className="group/terminal relative w-80 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1b26]/85 font-mono shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7),0_8px_24px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] ring-1 ring-black/40 backdrop-blur-2xl backdrop-saturate-150 xl:w-[340px]">
      {/* Top specular highlight — the edge of glass catching light */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
      {/* Corner sheen — directional light source top-left */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,255,255,0.06),transparent_55%)]"
      />
      {/* Subtle diagonal shine — the signature of glass */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/2 -left-1/4 h-[200%] w-1/2 rotate-12 bg-gradient-to-b from-transparent via-white/[0.04] to-transparent"
      />
      {/* Faint scanline texture for CRT feel */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.015)_0px,rgba(255,255,255,0.015)_1px,transparent_1px,transparent_3px)]"
      />

      {/* Title bar — real macOS window chrome */}
      <div className="relative flex items-center border-b border-black/40 bg-gradient-to-b from-[#3a3b47] to-[#2a2b36] px-3.5 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        {/* Traffic lights — 3D with inner highlight */}
        <div className="flex gap-2">
          <span
            className="h-[11px] w-[11px] rounded-full border border-black/20 bg-[#ff5f57] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.5),inset_0_-0.5px_0_rgba(0,0,0,0.2)]"
            aria-hidden="true"
          />
          <span
            className="h-[11px] w-[11px] rounded-full border border-black/20 bg-[#febc2e] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.5),inset_0_-0.5px_0_rgba(0,0,0,0.2)]"
            aria-hidden="true"
          />
          <span
            className="h-[11px] w-[11px] rounded-full border border-black/20 bg-[#28c840] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.5),inset_0_-0.5px_0_rgba(0,0,0,0.2)]"
            aria-hidden="true"
          />
        </div>
        {/* Centered window title — like a real terminal tab */}
        <span className="pointer-events-none absolute inset-x-0 text-center text-[11px] font-medium tracking-tight text-white/55">
          saran@arch — zsh — 80×24
        </span>
      </div>

      {/* Terminal body */}
      <div className="relative px-4 py-4" style={{ minHeight: "240px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-1"
          >
            {scene.lines.map((line, i) => {
              if (line.type === "cmd") {
                return (
                  <div key={i} className="flex items-center text-xs">
                    <span className="text-white/70">~</span>
                    <span className="ml-2 text-white">
                      {isTyping ? typedCmd : line.text}
                      {isTyping && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="ml-px inline-block h-3.5 w-1.5 translate-y-0.5 bg-white align-middle"
                        />
                      )}
                    </span>
                  </div>
                );
              }

              if (i >= visibleLines) return null;

              if (line.type === "blank") {
                return <div key={i} className="h-1.5" />;
              }

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -3 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  <span
                    className={`text-xs ${line.color || "text-white/80"}`}
                  >
                    {line.text}
                  </span>
                </motion.div>
              );
            })}

            {!isTyping && visibleLines >= scene.lines.length && (
              <div className="mt-2 flex items-center text-xs">
                <span className="text-white/70">~</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="ml-2 inline-block h-3.5 w-1.5 translate-y-0.5 bg-white"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
