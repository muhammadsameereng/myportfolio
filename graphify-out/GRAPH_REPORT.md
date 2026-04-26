# Graph Report - portfolio  (2026-04-26)

## Corpus Check
- 89 files · ~45,782 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 221 nodes · 203 edges · 11 communities detected
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 17 edges
2. `isSupabaseConfigured()` - 9 edges
3. `Loading()` - 6 edges
4. `GET()` - 6 edges
5. `POST()` - 6 edges
6. `main()` - 6 edges
7. `slugify()` - 5 edges
8. `clean()` - 5 edges
9. `isAdminEmail()` - 5 edges
10. `updateSession()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [INFERRED]
  proxy.ts → app/lib/supabase/middleware.ts
- `add()` --calls--> `main()`  [INFERRED]
  app/components/admin/FormFields.tsx → scripts/seed-csv-projects.ts
- `main()` --calls--> `upload()`  [INFERRED]
  scripts/mirror-csv-thumbnails.ts → app/components/admin/FormFields.tsx
- `signInWithMagicLink()` --calls--> `GET()`  [INFERRED]
  app/admin/actions.ts → app/api/admin/auth/callback/route.ts
- `signOut()` --calls--> `updateSession()`  [INFERRED]
  app/admin/actions.ts → app/lib/supabase/middleware.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (17): clean(), deleteBlogPost(), deleteCategory(), deleteProject(), saveBlogPost(), saveCategory(), saveProject(), signInWithMagicLink() (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (9): AdminBlogList(), AdminCategoriesPage(), AdminMediaPage(), AdminProjectsList(), EditBlogPostPage(), EditProjectPage(), NewBlogPostPage(), NewProjectPage() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (4): add(), remove(), applyTheme(), setThemeExternal()

### Community 3 - "Community 3"
Cohesion: 0.2
Nodes (6): estimateReadTime(), fetchPublishedRows(), formatDate(), rowToPost(), fetchPublishedRows(), createStaticClient()

### Community 4 - "Community 4"
Cohesion: 0.24
Nodes (8): updateSession(), proxy(), checkRateLimit(), escapeHtml(), GET(), isValidEmail(), newIdempotencyKey(), POST()

### Community 5 - "Community 5"
Cohesion: 0.32
Nodes (4): upload(), contentTypeFor(), extFromUrl(), main()

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (1): Loading()

### Community 8 - "Community 8"
Cohesion: 0.48
Nodes (5): main(), parseBool(), parseCSV(), parseJsonArray(), slugify()

### Community 10 - "Community 10"
Cohesion: 0.4
Nodes (2): generateMetadata(), generateStaticParams()

### Community 11 - "Community 11"
Cohesion: 0.6
Nodes (3): fadeUp(), Para(), SectionTitle()

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (1): " "()

## Knowledge Gaps
- **Thin community `Community 6`** (7 nodes): `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `Loading()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (6 nodes): `page.tsx`, `page.tsx`, `BlogDetailPage()`, `generateMetadata()`, `generateStaticParams()`, `ProjectDetailPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (4 nodes): `page.tsx`, `LoginForm.tsx`, `" "()`, `LoginPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 0` to `Community 3`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `upload()` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `add()` connect `Community 2` to `Community 8`, `Community 5`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `createClient()` (e.g. with `signInWithMagicLink()` and `signOut()`) actually correct?**
  _`createClient()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `isSupabaseConfigured()` (e.g. with `AdminMediaPage()` and `AdminCategoriesPage()`) actually correct?**
  _`isSupabaseConfigured()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `GET()` (e.g. with `signInWithMagicLink()` and `updateSession()`) actually correct?**
  _`GET()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._