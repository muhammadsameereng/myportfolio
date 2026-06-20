import "server-only";
import { ImageResponse } from "next/og";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ImageConfig } from "./config";

/**
 * Renders a branded title card (free, on-brand — Gemini image models are
 * paid) using the same visual language as the site OG cards, then uploads
 * it to the Supabase `media` bucket and returns its public URL.
 *
 * Failure is non-fatal: the caller continues without a cover image.
 */

export async function renderAndUploadTitleCard(
  supabase: SupabaseClient,
  cfg: ImageConfig,
  data: { title: string; date: string; readTime: string }
): Promise<string | null> {
  const { width, height } = cfg.size;

  const png = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: cfg.gradient,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          color: cfg.color,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: cfg.fontSizes.brand,
            fontWeight: 600,
          }}
        >
          <span>{cfg.brandMark}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: cfg.fontSizes.meta,
              color: cfg.mutedColor,
            }}
          >
            <span style={{ textTransform: "uppercase", letterSpacing: 2 }}>
              {data.date}
            </span>
            {data.readTime && <span>·</span>}
            {data.readTime && (
              <span style={{ textTransform: "uppercase", letterSpacing: 2 }}>
                {data.readTime}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: cfg.fontSizes.title,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.05,
              maxWidth: cfg.titleMaxWidth,
            }}
          >
            {data.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: cfg.fontSizes.footer,
            color: cfg.mutedColor,
          }}
        >
          <span>{cfg.footer.left}</span>
          <span>{cfg.footer.right}</span>
        </div>
      </div>
    ),
    { width, height }
  );

  const bytes = Buffer.from(await png.arrayBuffer());
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `${cfg.pathPrefix}/${Date.now()}-${rand}.png`;

  const { error } = await supabase.storage
    .from(cfg.bucket)
    .upload(path, bytes, {
      contentType: "image/png",
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) {
    console.warn(`[blog-pipeline] title-card upload failed: ${error.message}`);
    return null;
  }

  const { data: pub } = supabase.storage.from(cfg.bucket).getPublicUrl(path);
  return pub.publicUrl ?? null;
}
