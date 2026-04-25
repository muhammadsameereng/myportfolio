import type { Metadata } from "next";
import AboutPageContent from "../components/AboutPageContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About — Saran Zafar",
  description:
    "About Saran Zafar — a full-stack engineer from Kashmir building calm, dependable software.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutPageContent />
    </main>
  );
}
