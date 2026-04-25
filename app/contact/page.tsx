import type { Metadata } from "next";
import ContactPageContent from "../components/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact — Saran Zafar",
  description:
    "Get in touch with Saran Zafar — full-stack engineer based in Kashmir. Replies within 24 hours.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactPageContent />
    </main>
  );
}
