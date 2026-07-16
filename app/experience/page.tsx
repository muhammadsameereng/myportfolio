import type { Metadata } from "next";
import ExperiencePageContent from "../components/ExperiencePageContent";
import { JsonLd, breadcrumbLd } from "../components/JsonLd";

export const revalidate = 3600;

const description =
  "Muhammad Sameer's engineering experience across three lanes — Backend Development (Node.js, NestJS, PostgreSQL), Mobile App Development (Flutter & React Native), and Full-Stack Development (Next.js, React, TypeScript).";

export const metadata: Metadata = {
  title: "Experience — Muhammad Sameer",
  description,
  keywords: [
    "Muhammad Sameer experience",
    "backend development",
    "mobile app development",
    "Flutter developer",
    "React Native developer",
    "full stack development",
    "NestJS",
    "Next.js",
    "Node.js",
  ],
  alternates: { canonical: "/experience" },
  openGraph: {
    title: "Experience — Muhammad Sameer",
    description,
    url: "/experience",
    type: "website",
  },
};

export default function ExperiencePage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Experience", path: "/experience" },
        ])}
      />
      <ExperiencePageContent />
    </main>
  );
}
