import type { Metadata } from "next";
import ContactPageContent from "../components/ContactPageContent";
import { JsonLd, breadcrumbLd } from "../components/JsonLd";

// Pure UI page — fully static so the CDN can serve it indefinitely
// between deploys. The form posts to /api/contact, which is uncached.
export const dynamic = "force-static";

const description =
  "Get in touch with Muhammad Sameer — full-stack software engineer based in Kotli, Azad Kashmir. Available for backend, mobile, and full-stack work. Replies within 24 hours.";

export const metadata: Metadata = {
  title: "Contact — Muhammad Sameer",
  description,
  keywords: [
    "contact Muhammad Sameer",
    "hire full stack developer",
    "hire React Next.js developer",
    "hire NestJS backend engineer",
    "hire React Native developer",
    "freelance software engineer Pakistan",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Muhammad Sameer",
    description,
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <ContactPageContent />
    </main>
  );
}
