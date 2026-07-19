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
  "@id": `${SITE}/#person`,
  name: "Muhammad Sameer",
  alternateName: ["Sameer", "Muhammad Sameer AJK", "M. Sameer"],
  url: SITE,
  mainEntityOfPage: `${SITE}/about`,
  jobTitle: "Software Engineer",
  hasOccupation: {
    "@type": "Occupation",
    name: "Full-Stack Software Engineer",
    occupationLocation: {
      "@type": "City",
      name: "Kotli, Azad Jammu and Kashmir",
    },
    skills:
      "React, Next.js, TypeScript, Node.js, NestJS, React Native, Flutter, PostgreSQL, Docker, AWS",
  },
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

/**
 * Organization schema — a strong "this-is-a-site" anchor for Google's
 * site-name picker. A lone Person node is a weaker signal; pairing it with
 * an Organization (as established sites like schools/businesses do) gives
 * Google a confident name to display instead of falling back to the host
 * platform's brand. `name` is what should appear as the site name.
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "Muhammad Sameer",
  alternateName: ["Muhammad Sameer — Software Engineer", "Muhammad Sameer AJK"],
  url: SITE,
  logo: {
    "@type": "ImageObject",
    url: `${SITE}/img/msameer-image.png`,
  },
  image: `${SITE}/img/msameer-image.png`,
  email: "mailto:msameerdevelops@gmail.com",
  founder: { "@id": `${SITE}/#person` },
  employee: { "@id": `${SITE}/#person` },
  description:
    "Software engineering by Muhammad Sameer — full-stack React/Next.js, Node.js & NestJS APIs, and React Native mobile apps.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kotli, Azad Jammu and Kashmir",
    addressRegion: "AJK",
    addressCountry: "PK",
  },
  sameAs: [
    "https://github.com/muhammadsameereng",
    "https://www.linkedin.com/in/muhammad-sameer",
    "https://www.instagram.com/m.sameer.dev/",
    "https://gitlab.com/sameerorg-group/sameerorg-project/",
  ],
};

/**
 * WebSite schema — linked to the Person and Organization via @id so Google
 * understands this site *is about* Muhammad Sameer and is *published by* the
 * Muhammad Sameer organization. `name` + `alternateName` are the fields
 * Google reads for the site-name shown in search results.
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: "Muhammad Sameer",
  alternateName: ["Muhammad Sameer — Software Engineer", "Muhammad Sameer AJK"],
  url: SITE,
  inLanguage: "en",
  about: { "@id": `${SITE}/#person` },
  mainEntity: { "@id": `${SITE}/#person` },
  publisher: { "@id": `${SITE}/#organization` },
  author: { "@id": `${SITE}/#person` },
};

/**
 * ProfilePage schema — Google's dedicated type for "a page about a person".
 * Placed on /about and linked to the same #person node, it tells Google the
 * canonical page describing Muhammad Sameer.
 */
export const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE}/about#profilepage`,
  url: `${SITE}/about`,
  name: "About Muhammad Sameer",
  mainEntity: { "@id": `${SITE}/#person` },
  about: { "@id": `${SITE}/#person` },
  isPartOf: { "@id": `${SITE}/#website` },
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
