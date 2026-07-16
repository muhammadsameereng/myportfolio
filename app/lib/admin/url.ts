import { headers } from "next/headers";

export { safeNextPath } from "./redirect";

/**
 * Resolve the canonical site origin used for auth email links.
 *
 * Order of precedence:
 *   1. NEXT_PUBLIC_SITE_URL  — what production should always use.
 *   2. Request origin        — only honoured for localhost/private hosts in dev,
 *                              so a forged Host/Origin header in production
 *                              can't trick us into emailing attacker-controlled
 *                              redirect URLs.
 *   3. https://sameer-khan.vercel.app — last-resort hard default.
 */
export async function getSiteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return stripTrailingSlash(configured);

  const h = await headers();
  const host = h.get("host") || "";
  if (isLocalHost(host)) {
    const proto = h.get("x-forwarded-proto") || "http";
    return `${proto}://${host}`;
  }

  return "https://sameer-khan.vercel.app";
}

function stripTrailingSlash(s: string) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

function isLocalHost(host: string) {
  const h = host.toLowerCase().split(":")[0];
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "0.0.0.0" ||
    h === "[::1]" ||
    h.endsWith(".local")
  );
}
