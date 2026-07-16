import { ImageResponse } from "next/og";
import { getPublicPostBySlug } from "../../lib/public/blog";

// Node runtime — Supabase SSR client uses cookies; edge-cookie quirks
// are easier to avoid than to debug.
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog — Muhammad Sameer";

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  const title = post?.title ?? "Blog post";
  const date = post?.date ?? "";
  const readTime = post?.readTime ?? "";
  const excerpt = post?.excerpt ?? "";

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
          <span>msameer</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#737373" }}>
            <span style={{ textTransform: "uppercase", letterSpacing: 2 }}>{date}</span>
            <span>·</span>
            <span style={{ textTransform: "uppercase", letterSpacing: 2 }}>{readTime}</span>
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
          {excerpt && (
            <div style={{ fontSize: 26, color: "#525252", maxWidth: 1000, lineHeight: 1.4 }}>
              {excerpt}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#737373" }}>
          <span>sameer-khan.vercel.app / blog</span>
          <span>Muhammad Sameer</span>
        </div>
      </div>
    ),
    size
  );
}
