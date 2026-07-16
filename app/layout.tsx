import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "./components/ThemeProvider";
import PublicChrome from "./components/PublicChrome";
import { JsonLd, personSchema, websiteSchema } from "./components/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Display font — Space Grotesk for all headings / wordmarks. Body stays Geist.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://msameer.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Muhammad Sameer — Software Engineer",
    template: "%s",
  },
  description:
    "Full-stack engineer from Azad Kashmir, building React/Next.js frontends backed by Node.js & NestJS APIs and React Native apps.",
  applicationName: "Muhammad Sameer",
  authors: [{ name: "Muhammad Sameer", url: SITE_URL }],
  creator: "Muhammad Sameer",
  keywords: [
    "Muhammad Sameer",
    "Software Engineer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "NestJS",
    "Node.js",
    "React Native",
    "TypeScript",
    "Azad Kashmir",
  ],
  openGraph: {
    type: "website",
    siteName: "Muhammad Sameer",
    url: SITE_URL,
    title: "Muhammad Sameer — Software Engineer",
    description:
      "Full-stack engineer from Azad Kashmir, building React/Next.js frontends backed by Node.js & NestJS APIs and React Native apps.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Sameer — Software Engineer",
    description:
      "Full-stack engineer from Azad Kashmir, building React/Next.js frontends backed by Node.js & NestJS APIs and React Native apps.",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  verification: {
    google: "PlXyjRohy4U_s239YKGZHe4-LqnUDy7Nm2jAK38zIX0",
  },
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#071413" },
  ],
  colorScheme: "light dark",
};

const themeScript = `
  try {
    var t = localStorage.getItem('theme');
    var d = document.documentElement;
    if (t === 'light') {
      d.classList.remove('dark');
      d.style.colorScheme = 'light';
    } else {
      d.classList.add('dark');
      d.style.colorScheme = 'dark';
    }
  } catch(e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Theme bootstrap — runs before paint to avoid FOUC. next/script
            with beforeInteractive injects it into the initial HTML head
            (executes before hydration) and avoids React's "script tag in a
            component" warning that a raw <script> triggers. */}
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeScript}
        </Script>

        {/* DNS-prefetch only — no above-the-fold images come from these
            origins, so a full preconnect would waste a handshake. */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://i.pravatar.cc" />
        <link rel="dns-prefetch" href="https://api.resend.com" />
        <link rel="dns-prefetch" href="https://challenges.cloudflare.com" />

        {/* Site-wide structured data */}
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      {/* suppressHydrationWarning: browser extensions inject __processed_* and bis_register attrs */}
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground antialiased grain">
        <ThemeProvider>
          <PublicChrome>{children}</PublicChrome>
        </ThemeProvider>
        {/* Vercel real-user telemetry — Analytics: page views + custom events.
            Speed Insights: real Web Vitals from production traffic. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
