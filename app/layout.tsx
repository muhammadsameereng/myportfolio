import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./components/ThemeProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://saranzafar.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Saran Zafar — Software Engineer",
    template: "%s",
  },
  description:
    "Full-stack engineer from Kashmir, building scalable backend systems and modern web applications.",
  applicationName: "Saran Zafar",
  authors: [{ name: "Saran Zafar", url: SITE_URL }],
  creator: "Saran Zafar",
  keywords: [
    "Saran Zafar",
    "Software Engineer",
    "Full Stack Developer",
    "NestJS",
    "Next.js",
    "TypeScript",
    "Backend Engineer",
    "Kashmir",
  ],
  openGraph: {
    type: "website",
    siteName: "Saran Zafar",
    url: SITE_URL,
    title: "Saran Zafar — Software Engineer",
    description:
      "Full-stack engineer from Kashmir, building scalable backend systems and modern web applications.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saran Zafar — Software Engineer",
    description:
      "Full-stack engineer from Kashmir, building scalable backend systems and modern web applications.",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
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
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme bootstrap — runs before paint to avoid FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* Preconnect to remote image hosts so first images start downloading
            in parallel with the document parse. */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://i.pravatar.cc" />
        <link rel="dns-prefetch" href="https://api.resend.com" />
        <link rel="dns-prefetch" href="https://challenges.cloudflare.com" />

        {/* Site-wide structured data */}
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased grain">
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
        {/* Vercel real-user telemetry — Analytics: page views + custom events.
            Speed Insights: real Web Vitals from production traffic. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
