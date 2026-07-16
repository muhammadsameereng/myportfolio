import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Muhammad Sameer — Software Engineer";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "linear-gradient(135deg, #fafafa 0%, #f3f4f6 60%, #e5e7eb 100%)",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#0a0a0a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 600 }}>
          <span>✦</span>
          <span>msameer</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.05,
            }}
          >
            Software Engineer
          </div>
          <div style={{ fontSize: 32, color: "#525252", maxWidth: 900, lineHeight: 1.3 }}>
            Full-stack engineer from Azad Kashmir — React/Next.js, NestJS &amp;
            React Native.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#737373",
          }}
        >
          <span>msameer.vercel.app</span>
          <span>● Available for work</span>
        </div>
      </div>
    ),
    size
  );
}
