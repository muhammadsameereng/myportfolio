/**
 * JSON-LD primitive — emits a structured-data <script> tag.  Server-only,
 * no client JS shipped.  Tiny but huge SEO value (Google rich results).
 */
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export function JsonLd({ data }: { data: JsonValue }) {
  return (
    <script
      type="application/ld+json"
      // Safe: the data is server-controlled, not user input.
      // suppressHydrationWarning: browser extensions replace type/src on script tags
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://msameer.vercel.app";

/** Person schema — used on the home + about pages. */
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Sameer",
  url: SITE,
  jobTitle: "Software Engineer",
  description:
    "Full-stack engineer from Azad Kashmir building React/Next.js frontends, NestJS APIs, and React Native apps.",
  image: `${SITE}/img/msameer-image.png`,
  email: "mailto:msameerdevelops@gmail.com",
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "NestJS",
    "React Native",
    "Flutter",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Docker",
    "AWS",
    "Full-Stack Development",
    "Backend Development",
    "Mobile App Development",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Kotli, Azad Jammu & Kashmir",
  },
  sameAs: [
    "https://github.com/muhammadsameereng",
    "https://www.linkedin.com/in/muhammad-sameer",
    "https://www.instagram.com/m.sameer.dev/",
    "https://gitlab.com/sameerorg-group/sameerorg-project/",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kotli, Azad Jammu and Kashmir",
    addressRegion: "AJK",
    addressCountry: "PK",
  },
};

/** BreadcrumbList — pass a trail of { name, path } (paths are relative). */
export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE}${c.path}`,
    })),
  };
}

/** WebSite schema — search-action ready. */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Muhammad Sameer",
  url: SITE,
  author: { "@type": "Person", name: "Muhammad Sameer" },
};

export function articleSchema(post: {
  title: string;
  excerpt: string;
  isoDate: string;
  thumb: string;
  slug: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.thumb,
    datePublished: post.isoDate,
    dateModified: post.isoDate,
    author: { "@type": "Person", name: "Muhammad Sameer", url: SITE },
    publisher: { "@type": "Person", name: "Muhammad Sameer" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };
}

export function projectSchema(project: {
  title: string;
  description: string;
  thumb: string;
  slug: string;
  category: string;
  year: number;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.thumb,
    url: `${SITE}/projects/${project.slug}`,
    creator: { "@type": "Person", name: "Muhammad Sameer", url: SITE },
    datePublished: `${project.year}-01-01`,
    keywords: [project.category, ...project.tags].join(", "),
  };
}

export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}
