# Graph Report - portfolio  (2026-05-02)

## Corpus Check
- 104 files · ~56,741 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 262 nodes · 236 edges · 12 communities detected
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 15 edges
2. `GET()` - 11 edges
3. `isSupabaseConfigured()` - 9 edges
4. `signInWithMagicLink()` - 6 edges
5. `Loading()` - 6 edges
6. `isAdminEmail()` - 6 edges
7. `updateSession()` - 6 edges
8. `POST()` - 6 edges
9. `main()` - 6 edges
10. `signOut()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [INFERRED]
  proxy.ts → app/lib/supabase/middleware.ts
- `add()` --calls--> `main()`  [INFERRED]
  app/components/admin/FormFields.tsx → scripts/seed-csv-projects.ts
- `signInWithMagicLink()` --calls--> `createClient()`  [INFERRED]
  app/admin/actions.ts → app/lib/supabase/client.ts
- `signOut()` --calls--> `createClient()`  [INFERRED]
  app/admin/actions.ts → app/lib/supabase/client.ts
- `AdminLayout()` --calls--> `createClient()`  [INFERRED]
  app/admin/layout.tsx → app/lib/supabase/client.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (17): signInWithMagicLink(), signOut(), getAdminEmails(), isAdminEmail(), AdminLayout(), updateSession(), proxy(), safeNextPath() (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.16
Nodes (13): clean(), deleteBlogPost(), deleteCategory(), deleteProject(), saveBlogPost(), saveCategory(), saveProject(), slugify() (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (9): AdminBlogList(), AdminCategoriesPage(), AdminMediaPage(), AdminProjectsList(), EditBlogPostPage(), EditProjectPage(), NewBlogPostPage(), NewProjectPage() (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (4): add(), remove(), applyTheme(), setThemeExternal()

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (1): Loading()

### Community 6 - "Community 6"
Cohesion: 0.48
Nodes (5): main(), parseBool(), parseCSV(), parseJsonArray(), slugify()

### Community 7 - "Community 7"
Cohesion: 0.47
Nodes (3): fadeUp(), Para(), SectionTitle()

### Community 8 - "Community 8"
Cohesion: 0.4
Nodes (2): generateMetadata(), generateStaticParams()

### Community 12 - "Community 12"
Cohesion: 0.6
Nodes (3): refresh(), remove(), upload()

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (2): fadeUp(), GithubActivity()

### Community 14 - "Community 14"
Cohesion: 0.6
Nodes (3): estimateReadTime(), formatDate(), rowToPost()

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (1): " "()

## Knowledge Gaps
- **Thin community `Community 4`** (7 nodes): `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `Loading()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (6 nodes): `page.tsx`, `page.tsx`, `BlogDetailPage()`, `generateMetadata()`, `generateStaticParams()`, `ProjectDetailPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (5 nodes): `GithubActivity.tsx`, `buildStreakUrl()`, `fadeUp()`, `GithubActivity()`, `GithubMark()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (4 nodes): `page.tsx`, `LoginForm.tsx`, `" "()`, `LoginPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `add()` connect `Community 3` to `Community 1`, `Community 6`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `GET()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `createClient()` (e.g. with `signInWithMagicLink()` and `signOut()`) actually correct?**
  _`createClient()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `GET()` (e.g. with `signInWithMagicLink()` and `getSiteOrigin()`) actually correct?**
  _`GET()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `isSupabaseConfigured()` (e.g. with `AdminMediaPage()` and `AdminCategoriesPage()`) actually correct?**
  _`isSupabaseConfigured()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `signInWithMagicLink()` (e.g. with `GET()` and `safeNextPath()`) actually correct?**
  _`signInWithMagicLink()` has 5 INFERRED edges - model-reasoned connections that need verification._