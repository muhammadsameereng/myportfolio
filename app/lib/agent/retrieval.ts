import "server-only";
import type { Project } from "@/app/lib/projects";
import type { BlogPost } from "@/app/lib/blogs";

// Lightweight server-side retrieval & intent inference for the chat.
// Pure functions, no deps, no LLM calls — keyword overlap + a regex table.
// The model still does the synthesis; we just give it the right slice.

export type Intent = "projects" | "blog" | "contact" | "about" | "other";

export type ScoredProject = { project: Project; score: number };
export type ScoredPost = { post: BlogPost; score: number };

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "do", "for", "from",
  "has", "have", "he", "him", "his", "how", "i", "in", "is", "it", "me",
  "my", "of", "on", "or", "saran", "show", "the", "to", "what", "where",
  "who", "why", "with", "you", "your", "tell", "about", "any", "some",
  "all", "this", "that", "those", "these", "can", "could", "would", "do",
  "does", "did", "will", "shall", "should", "may", "might", "us", "we",
  "they", "them", "their", "if", "but", "so", "not", "no", "yes",
]);

// Tokenize: lowercase, strip punctuation, drop stopwords + 1-letter tokens.
function tokenize(s: string): Set<string> {
  const tokens = new Set<string>();
  for (const raw of s.toLowerCase().split(/[^a-z0-9+#]+/)) {
    if (raw.length < 2) continue;
    if (STOPWORDS.has(raw)) continue;
    tokens.add(raw);
  }
  return tokens;
}

// Light-weight Jaccard-ish overlap with a small bonus for tag/title hits.
function score(query: Set<string>, doc: { strong: string; weak: string }) {
  if (query.size === 0) return 0;
  const strong = tokenize(doc.strong);
  const weak = tokenize(doc.weak);
  let total = 0;
  for (const t of query) {
    if (strong.has(t)) total += 2;
    else if (weak.has(t)) total += 1;
  }
  return total;
}

export function selectRelevantProjects(
  projects: Project[],
  query: string,
  topN = 3
): ScoredProject[] {
  const q = tokenize(query);
  return projects
    .map((p) => ({
      project: p,
      score: score(q, {
        strong: [p.title, p.category, ...(p.tags || [])].join(" "),
        weak: [p.description, p.role, String(p.year || "")].join(" "),
      }),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

export function selectRelevantPosts(
  posts: BlogPost[],
  query: string,
  topN = 3
): ScoredPost[] {
  const q = tokenize(query);
  return posts
    .map((p) => ({
      post: p,
      score: score(q, {
        strong: [p.title, p.category || "", ...(p.tags || [])].join(" "),
        weak: [p.excerpt].join(" "),
      }),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

// Intent classifier — regex table over the latest user message. Cheap,
// transparent, easy to tune. Order matters: first match wins.
const INTENT_RULES: Array<{ intent: Intent; pattern: RegExp }> = [
  {
    intent: "contact",
    pattern:
      /\b(email|contact|hire|reach|message|get in touch|work together|available|availability|book|schedule|rate|pricing|cost|budget|quote)\b/i,
  },
  {
    intent: "blog",
    pattern: /\b(blog|post|article|writing|writes|read|essay|wrote)\b/i,
  },
  {
    intent: "projects",
    pattern:
      /\b(project|projects|work|case study|case studies|portfolio|built|build|shipped|client|clients|app|apps|website|saas|backend|frontend|nestjs|next\.?js|react|electron|mobile)\b/i,
  },
  {
    intent: "about",
    pattern:
      /\b(who|about|background|bio|experience|skills|stack|where|based|kashmir|ajk|pakistan|languages|philosophy|story)\b/i,
  },
];

export function classifyIntent(query: string): Intent {
  for (const { intent, pattern } of INTENT_RULES) {
    if (pattern.test(query)) return intent;
  }
  return "other";
}

const INTENT_HINT: Record<Intent, string> = {
  projects:
    "The visitor is asking about Saran's work. Cite specific projects from the expanded section when relevant.",
  blog: "The visitor is asking about Saran's writing. Cite specific posts from the expanded section when relevant.",
  contact:
    "The visitor wants to reach Saran. Offer the email tool early — collect name, email, and message, summarize, then call sendEmailToSaran on confirmation.",
  about:
    "The visitor wants to know about Saran himself. Use the Knowledge section. Keep it human and short.",
  other:
    "The intent is unclear. Briefly reorient the visitor to what you can help with (work, writing, contacting Saran).",
};

export function describeIntent(intent: Intent): string {
  return `Likely intent: ${intent}. ${INTENT_HINT[intent]}`;
}

// Renders the expanded items block — only the top hits, with full detail
// the model can ground a specific answer on.
export function renderExpandedProjects(items: ScoredProject[]): string {
  if (items.length === 0) return "(no closely matching projects)";
  return items
    .map(({ project: p }) => {
      const lines = [
        `- slug=${p.slug} | ${p.title} (${p.year || "—"}, ${p.category})`,
        `  role: ${p.role || "—"}`,
        `  tags: ${(p.tags || []).join(", ") || "—"}`,
        `  summary: ${p.description}`,
      ];
      return lines.join("\n");
    })
    .join("\n");
}

export function renderExpandedPosts(items: ScoredPost[]): string {
  if (items.length === 0) return "(no closely matching posts)";
  return items
    .map(({ post: p }) => {
      const lines = [
        `- slug=${p.slug} | ${p.title} (${p.date}, ${p.readTime})`,
        `  tags: ${(p.tags || []).join(", ") || "—"}`,
        `  excerpt: ${p.excerpt}`,
      ];
      return lines.join("\n");
    })
    .join("\n");
}
