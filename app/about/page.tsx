import type { Metadata } from "next";
import AboutPageContent from "../components/AboutPageContent";
import { JsonLd, breadcrumbLd, profilePageSchema } from "../components/JsonLd";

export const revalidate = 3600;

const description =
  "About Muhammad Sameer — a full-stack software engineer from Kotli, Azad Kashmir with 3+ years building React/Next.js frontends, Node.js & NestJS APIs, and React Native & Flutter apps.";

export const metadata: Metadata = {
  title: "About — Muhammad Sameer",
  description,
  keywords: [
    "Muhammad Sameer",
    "about Muhammad Sameer",
    "full stack software engineer",
    "Azad Kashmir developer",
    "Kotli software engineer",
    "React Next.js developer",
    "NestJS backend engineer",
    "React Native Flutter developer",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Muhammad Sameer",
    description,
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={profilePageSchema} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <AboutPageContent />
    </main>
  );
}
