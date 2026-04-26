# Graph Report - portfolio  (2026-04-26)

## Corpus Check
- 85 files · ~42,459 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 199 nodes · 173 edges · 9 communities detected
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 12|Community 12]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 16 edges
2. `isSupabaseConfigured()` - 9 edges
3. `Loading()` - 6 edges
4. `GET()` - 6 edges
5. `POST()` - 6 edges
6. `slugify()` - 5 edges
7. `clean()` - 5 edges
8. `isAdminEmail()` - 5 edges
9. `updateSession()` - 5 edges
10. `signInWithMagicLink()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [INFERRED]
  proxy.ts → app/lib/supabase/middleware.ts
- `upload()` --calls--> `createClient()`  [INFERRED]
  app/components/admin/FormFields.tsx → app/lib/supabase/client.ts
- `signInWithMagicLink()` --calls--> `createClient()`  [INFERRED]
  app/admin/actions.ts → app/lib/supabase/client.ts
- `signOut()` --calls--> `updateSession()`  [INFERRED]
  app/admin/actions.ts → app/lib/supabase/middleware.ts
- `AdminLayout()` --calls--> `isAdminEmail()`  [INFERRED]
  app/admin/layout.tsx → app/lib/admin/auth.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (14): clean(), deleteBlogPost(), deleteCategory(), deleteProject(), saveBlogPost(), saveCategory(), saveProject(), signOut() (+6 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (5): add(), upload(), remove(), applyTheme(), setThemeExternal()

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (9): AdminBlogList(), AdminCategoriesPage(), AdminMediaPage(), AdminProjectsList(), EditBlogPostPage(), EditProjectPage(), NewBlogPostPage(), NewProjectPage() (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (11): signInWithMagicLink(), getAdminEmails(), isAdminEmail(), updateSession(), proxy(), checkRateLimit(), escapeHtml(), GET() (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (1): Loading()

### Community 7 - "Community 7"
Cohesion: 0.4
Nodes (2): generateMetadata(), generateStaticParams()

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (2): fetchPublishedRows(), createStaticClient()

### Community 9 - "Community 9"
Cohesion: 0.6
Nodes (3): fadeUp(), Para(), SectionTitle()

### Community 12 - "Community 12"
Cohesion: 0.5
Nodes (1): " "()

## Knowledge Gaps
- **Thin community `Community 4`** (7 nodes): `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `Loading()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (6 nodes): `page.tsx`, `page.tsx`, `BlogDetailPage()`, `generateMetadata()`, `generateStaticParams()`, `ProjectDetailPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (6 nodes): `projects.ts`, `static.ts`, `fetchPublishedRows()`, `getProjects()`, `rowToProject()`, `createStaticClient()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (4 nodes): `page.tsx`, `LoginForm.tsx`, `" "()`, `LoginPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 0` to `Community 8`, `Community 1`, `Community 3`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `upload()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `createClient()` (e.g. with `signInWithMagicLink()` and `signOut()`) actually correct?**
  _`createClient()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `isSupabaseConfigured()` (e.g. with `AdminMediaPage()` and `AdminCategoriesPage()`) actually correct?**
  _`isSupabaseConfigured()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `GET()` (e.g. with `signInWithMagicLink()` and `updateSession()`) actually correct?**
  _`GET()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._