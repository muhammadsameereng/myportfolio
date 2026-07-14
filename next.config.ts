import type { NextConfig } from "next";

const ONE_YEAR = 60 * 60 * 24 * 365;
const ONE_HOUR = 60 * 60;
const ONE_DAY = 60 * 60 * 24;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // Image pipeline — modern formats, properly sized, allow remote sources we use.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: ONE_YEAR,
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 160, 200, 256, 384],
    qualities: [50, 60, 70, 75, 85, 95],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      // Supabase Storage — public bucket for project / blog / upload media.
      // Wildcard covers any *.supabase.co project; explicit entry is a
      // belt-and-braces fallback in case the wildcard matcher misbehaves.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "yjmsljuwzsectyhpodvf.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Bundle hygiene — barrel-tree-shake heavy libs + inline ALL CSS into the
  // HTML so there's no render-blocking <link rel="stylesheet">. Next 16's
  // `inlineCss` is the supported replacement for the older critters-based
  // `optimizeCss` flag — it works at the App-Router level and produces a
  // single inlined <style> per page.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    inlineCss: true,
  },
  // Disable Next 16 typed routes for now — admin uses dynamic ids that
  // typed-routes can't always infer cleanly. Reintroduce later if needed.
  typedRoutes: false,

  // The AI blog pipeline reads `blog-pipeline.yml` and the example posts at
  // runtime via fs. Those aren't `import`ed, so Next's output file tracing
  // wouldn't bundle them into the serverless function on its own — declare
  // them explicitly for the processing route.
  outputFileTracingIncludes: {
    "/api/blog-jobs/[id]/process": [
      "./blog-pipeline.yml",
      "./scripts/blogs/*.md",
    ],
  },

  // HTTP cache strategy — three tiers:
  //   • /_next/static + /img/*  → year-long immutable (filename is the cache key)
  //   • HTML pages              → CDN s-maxage 1h, SWR 1d
  //   • /api/contact            → no-store (POST + side effects)
  async headers() {
    return [
      {
        // Next already serves _next/static with immutable, year-long caching.
        // We only need to add custom headers for our own /img assets.
        source: "/img/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
        ],
      },
      {
        source: "/(favicon.ico|robots.txt|sitemap.xml)",
        headers: [
          { key: "Cache-Control", value: `public, max-age=${ONE_DAY}` },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        // Default for HTML pages — short CDN cache + long SWR
        source: "/((?!_next|api|img).*)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, s-maxage=${ONE_HOUR}, stale-while-revalidate=${ONE_DAY}`,
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
