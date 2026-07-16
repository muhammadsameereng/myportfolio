import type { Metadata } from "next";
import ContactPageContent from "../components/ContactPageContent";

// Pure UI page — fully static so the CDN can serve it indefinitely
// between deploys. The form posts to /api/contact, which is uncached.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Contact — Muhammad Sameer",
  description:
    "Get in touch with Muhammad Sameer — full-stack engineer based in Azad Kashmir. Replies within 24 hours.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactPageContent />
    </main>
  );
}
