"use client";

import { motion } from "framer-motion";

// Primary circuit — the main system backbone
const primaryPath =
  "M -20 280 L 100 280 L 100 200 L 200 200 L 200 280 L 340 280 " +
  "L 340 180 L 460 180 L 460 300 L 580 300 L 580 220 L 700 220 " +
  "L 700 320 L 840 320 L 840 200 L 960 200 L 960 280 L 1080 280 " +
  "L 1080 160 L 1200 160 L 1200 260 L 1320 260 L 1320 180 L 1460 180";

// Secondary circuit — a ghost layer, offset, creating depth
const secondaryPath =
  "M -20 420 L 160 420 L 160 360 L 300 360 L 300 440 L 480 440 " +
  "L 480 380 L 640 380 L 640 460 L 800 460 L 800 380 L 960 380 " +
  "L 960 440 L 1100 440 L 1100 360 L 1260 360 L 1260 420 L 1460 420";

// Tertiary — very top, subtle wiring
const tertiaryPath =
  "M -20 100 L 180 100 L 180 60 L 400 60 L 400 120 L 600 120 " +
  "L 600 70 L 820 70 L 820 130 L 1000 130 L 1000 80 L 1200 80 L 1200 110 L 1460 110";

// Branches — varied lengths and directions
const branches = [
  { d: "M 200 200 L 200 120 L 280 120", delay: 2.0 },
  { d: "M 340 180 L 340 100", delay: 2.3 },
  { d: "M 580 300 L 580 400 L 500 400", delay: 2.8 },
  { d: "M 840 200 L 840 110 L 940 110 L 940 140", delay: 3.2 },
  { d: "M 1080 160 L 1080 80 L 1180 80", delay: 3.6 },
  { d: "M 1200 260 L 1200 340 L 1300 340", delay: 4.0 },
  { d: "M 700 320 L 700 400", delay: 3.0 },
  { d: "M 460 180 L 460 100 L 380 100", delay: 2.6 },
  { d: "M 300 360 L 300 300", delay: 3.4 },
  { d: "M 800 460 L 800 520 L 900 520", delay: 3.8 },
  { d: "M 1100 360 L 1100 300", delay: 4.2 },
  // Cross-connections between primary and secondary
  { d: "M 460 300 L 480 380", delay: 3.6 },
  { d: "M 960 280 L 960 380", delay: 4.0 },
];

// Junction nodes — infrastructure-grade naming
const junctions = [
  { x: 100, y: 280, size: 6, delay: 0.8 },
  { x: 200, y: 200, size: 9, delay: 1.1, label: "API Gateway" },
  { x: 340, y: 180, size: 7, delay: 1.4, label: "Nginx" },
  { x: 460, y: 180, size: 6, delay: 1.6 },
  { x: 580, y: 300, size: 9, delay: 1.9, label: "REST API" },
  { x: 700, y: 220, size: 6, delay: 2.1 },
  { x: 840, y: 320, size: 9, delay: 2.4, label: "Microservice" },
  { x: 960, y: 200, size: 7, delay: 2.6 },
  { x: 1080, y: 160, size: 9, delay: 2.9, label: "SQS" },
  { x: 1200, y: 260, size: 7, delay: 3.2, label: "S3" },
  { x: 1320, y: 180, size: 6, delay: 3.5 },
  { x: 280, y: 120, size: 6, delay: 2.3, label: "OAuth 2.0" },
  { x: 940, y: 110, size: 6, delay: 3.5, label: "Redis" },
  { x: 1180, y: 80, size: 6, delay: 3.9, label: "CloudFront" },
  { x: 1300, y: 340, size: 6, delay: 4.3, label: "React SPA" },
  { x: 380, y: 100, size: 6, delay: 2.9, label: "JWT" },
  { x: 300, y: 360, size: 6, delay: 2.0 },
  { x: 640, y: 380, size: 6, delay: 2.5 },
  { x: 800, y: 460, size: 8, delay: 2.8, label: "RDS" },
  { x: 1100, y: 360, size: 6, delay: 3.2, label: "WebSocket" },
  { x: 900, y: 520, size: 6, delay: 4.0, label: "Read Replica" },
];

// Annotations — real infra & DevOps context
const annotations = [
  { x: 150, y: 192, text: "port:443", delay: 2.5 },
  { x: 580, y: 212, text: "NestJS v10", delay: 3.0 },
  { x: 840, y: 192, text: "Docker Compose", delay: 3.5 },
  { x: 1080, y: 150, text: "RabbitMQ", delay: 4.0 },
  { x: 800, y: 450, text: "PostgreSQL 16", delay: 3.8 },
  { x: 200, y: 112, text: "RBAC + MFA", delay: 3.2 },
  { x: 1200, y: 250, text: "Supabase", delay: 4.3 },
  { x: 460, y: 170, text: "CI/CD", delay: 3.4 },
  { x: 960, y: 192, text: "K8s Pod", delay: 3.7 },
  { x: 700, y: 312, text: "SSR / ISR", delay: 3.3 },
];

// Tick marks
const ticks = [
  { x: 100, y: 280, angle: 0 },
  { x: 580, y: 300, angle: 0 },
  { x: 1080, y: 160, angle: 90 },
  { x: 840, y: 320, angle: 0 },
  { x: 300, y: 360, angle: 90 },
  { x: 460, y: 300, angle: 90 },
  { x: 1200, y: 160, angle: 0 },
];

// Data packets
const packets = [
  { path: primaryPath, delay: 4, duration: 9, r: 3 },
  { path: primaryPath, delay: 9, duration: 11, r: 2.5 },
  { path: secondaryPath, delay: 6, duration: 13, r: 2.5 },
  { path: secondaryPath, delay: 12, duration: 10, r: 2 },
  { path: tertiaryPath, delay: 8, duration: 15, r: 2 },
];

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{ minHeight: "100vh" }}
      >
        {/* ── Tertiary circuit (top, faintest) ─────────────────── */}
        <motion.path
          d={tertiaryPath}
          stroke="var(--foreground)"
          strokeWidth="0.5"
          strokeOpacity="0.04"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 6, ease: "easeInOut", delay: 1.5 }}
        />

        {/* ── Secondary circuit (middle depth) ─────────────────── */}
        <motion.path
          d={secondaryPath}
          stroke="var(--foreground)"
          strokeWidth="0.8"
          strokeOpacity="0.06"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, ease: "easeInOut", delay: 0.8 }}
        />

        {/* ── Primary circuit (boldest) ────────────────────────── */}
        <motion.path
          d={primaryPath}
          stroke="var(--foreground)"
          strokeWidth="1.2"
          strokeOpacity="0.1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut", delay: 0.3 }}
        />

        {/* ── Branch paths ──────────────────────────────────────── */}
        {branches.map((branch, i) => (
          <motion.path
            key={`branch-${i}`}
            d={branch.d}
            stroke="var(--foreground)"
            strokeWidth="0.7"
            strokeOpacity="0.07"
            strokeDasharray="4 5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: branch.delay }}
          />
        ))}

        {/* ── Tick marks ───────────────────────────────────────── */}
        {ticks.map((tick, i) => (
          <motion.line
            key={`tick-${i}`}
            x1={tick.angle === 0 ? tick.x - 5 : tick.x}
            y1={tick.angle === 0 ? tick.y : tick.y - 5}
            x2={tick.angle === 0 ? tick.x + 5 : tick.x}
            y2={tick.angle === 0 ? tick.y : tick.y + 5}
            stroke="var(--foreground)"
            strokeWidth="0.6"
            strokeOpacity="0.08"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 2.0 + i * 0.2 }}
          />
        ))}

        {/* ── Junction nodes ───────────────────────────────────── */}
        {junctions.map((node, i) => (
          <g key={`junction-${i}`}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size / 2}
              stroke="var(--foreground)"
              strokeWidth="0.8"
              strokeOpacity="0.12"
              fill="var(--background)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: node.delay }}
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={1.2}
              fill="var(--foreground)"
              fillOpacity="0.15"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: node.delay + 0.15 }}
            />
            {node.label && (
              <motion.text
                x={node.x}
                y={node.y - node.size / 2 - 6}
                textAnchor="middle"
                fill="var(--foreground)"
                fillOpacity="0.12"
                fontSize="9"
                fontFamily="var(--font-mono), monospace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: node.delay + 0.2 }}
              >
                {node.label}
              </motion.text>
            )}
          </g>
        ))}

        {/* ── Annotations ──────────────────────────────────────── */}
        {annotations.map((ann, i) => (
          <motion.text
            key={`ann-${i}`}
            x={ann.x}
            y={ann.y}
            fill="var(--foreground)"
            fillOpacity="0.06"
            fontSize="7"
            fontFamily="var(--font-mono), monospace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: ann.delay }}
          >
            {ann.text}
          </motion.text>
        ))}

        {/* ── Traveling data packets ────────────────────────────── */}
        {packets.map((packet, i) => (
          <g key={`packet-${i}`}>
            {/* Glow behind packet */}
            <motion.circle
              r={packet.r * 3}
              fill="var(--foreground)"
              fillOpacity="0.03"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{
                duration: packet.duration,
                delay: packet.delay,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 3,
              }}
              style={{
                offsetPath: `path("${packet.path}")`,
                offsetRotate: "0deg",
              }}
            />
            {/* Packet core */}
            <motion.circle
              r={packet.r}
              fill="var(--foreground)"
              fillOpacity="0.18"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{
                duration: packet.duration,
                delay: packet.delay,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 3,
              }}
              style={{
                offsetPath: `path("${packet.path}")`,
                offsetRotate: "0deg",
              }}
            />
          </g>
        ))}

        {/* ── Pulse rings on key nodes ──────────────────────────── */}
        {junctions
          .filter((n) => n.size >= 9)
          .map((node, i) => (
            <motion.circle
              key={`pulse-${i}`}
              cx={node.x}
              cy={node.y}
              r={node.size / 2}
              stroke="var(--foreground)"
              strokeWidth="0.5"
              fill="none"
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 4, 1],
                opacity: [0.08, 0, 0.08],
              }}
              transition={{
                duration: 6,
                delay: node.delay + 2 + i * 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
      </svg>

      {/* ── Content protection — tighter, let more bg show ───── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse 38% 40% at 25% 48%, var(--background) 0%, transparent 100%),
            radial-gradient(ellipse 20% 22% at 40% 50%, var(--background) 0%, transparent 100%)
          `,
        }}
      />

      {/* ── Edge vignette ──────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, var(--background) 0%, transparent 4%, transparent 94%, var(--background) 100%),
            linear-gradient(to bottom, var(--background) 0%, transparent 3%, transparent 95%, var(--background) 100%)
          `,
        }}
      />
    </div>
  );
}
