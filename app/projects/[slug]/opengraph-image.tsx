import { ImageResponse } from "next/og";
import { getPublicProjectBySlug } from "../../lib/public/projects";

// Edge-rendered on first request, then CDN-cached.
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project — Saran Zafar";

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  const title = project?.title ?? "Project";
  const category = project?.category ?? "Work";
  const year = project?.year ?? "";
  const description = project?.description ?? "";

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
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 26, fontWeight: 600 }}>
          <span>✦</span>
          <span>saranzafar</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 22, color: "#737373" }}>
            <span
              style={{
                background: "#0a0a0a",
                color: "#fafafa",
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 18,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {category}
            </span>
            <span>·</span>
            <span>{year}</span>
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.05,
              maxWidth: 1050,
            }}
          >
            {title}
          </div>
          {description && (
            <div style={{ fontSize: 26, color: "#525252", maxWidth: 1000, lineHeight: 1.4 }}>
              {description}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#737373" }}>
          <span>saranzafar.com / projects</span>
          <span>Saran Zafar</span>
        </div>
      </div>
    ),
    size
  );
}
