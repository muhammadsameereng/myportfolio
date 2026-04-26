import type { MetadataRoute } from "next";

/**
 * robots.txt — three-directive policy per Google's "essentials":
 * `User-agent`, `Disallow`, and `Sitemap` cover 90% of needs without
 * the noise that comes from over-tuning.
 *
 * Choices made here:
 * - All crawlers allowed by default (it's a public portfolio).
 * - `/admin/`, `/api/`, and `/_next/` are off-limits — admin is gated
 *   anyway, but explicit disallow stops crawlers from wasting budget
 *   on auth-redirect pages and internal asset paths.
 * - The `host:` directive is omitted — it's a Yandex-specific hint
 *   that Google has never honoured; including it adds noise.
 * - AI training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot,
 *   PerplexityBot) get explicit `Allow: /` rules. The intent here is
 *   visibility — this is a portfolio meant to surface in answers from
 *   AI chat products. If the intent ever flips to "no AI training",
 *   change these blocks to `Disallow: /`.
 *
 * References:
 *   https://developers.google.com/search/docs/crawling-indexing/robots/intro
 *   https://platform.openai.com/docs/gptbot
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://saranzafar.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/"],
      },
      // Explicitly opt in major AI crawlers so this portfolio shows up
      // in answers from ChatGPT, Claude, Perplexity, Gemini answer cards.
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "PerplexityBot",
          "Perplexity-User",
          "CCBot",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
