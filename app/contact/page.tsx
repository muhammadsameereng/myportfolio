import type { Metadata } from "next";
import ContactPageContent from "../components/ContactPageContent";

// Pure UI page — fully static so the CDN can serve it indefinitely
// between deploys. The form posts to /api/contact, which is uncached.
export const dynamic = "force-static";

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
