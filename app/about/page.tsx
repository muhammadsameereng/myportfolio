import type { Metadata } from "next";
import AboutPageContent from "../components/AboutPageContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About — Muhammad Sameer",
  description:
    "About Muhammad Sameer — a full-stack engineer from Azad Kashmir building React/Next.js frontends, NestJS APIs, and React Native apps.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutPageContent />
    </main>
  );
}
