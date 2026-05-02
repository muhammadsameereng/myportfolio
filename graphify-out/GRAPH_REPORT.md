# Graph Report - portfolio  (2026-05-02)

## Corpus Check
- 101 files · ~56,060 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 255 nodes · 222 edges · 13 communities detected
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 15 edges
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
- `signInWithMagicLink()` --calls--> `GET()`  [INFERRED]
  app/admin/actions.ts → app/api/admin/auth/callback/route.ts
- `AdminMediaPage()` --calls--> `isSupabaseConfigured()`  [INFERRED]
  app/admin/media/page.tsx → app/components/admin/SupabaseGuard.tsx
- `AdminCategoriesPage()` --calls--> `isSupabaseConfigured()`  [INFERRED]
  app/admin/categories/page.tsx → app/components/admin/SupabaseGuard.tsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (18): clean(), deleteBlogPost(), deleteCategory(), deleteProject(), saveBlogPost(), saveCategory(), saveProject(), signInWithMagicLink() (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (9): AdminBlogList(), AdminCategoriesPage(), AdminMediaPage(), AdminProjectsList(), EditBlogPostPage(), EditProjectPage(), NewBlogPostPage(), NewProjectPage() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (4): add(), remove(), applyTheme(), setThemeExternal()

### Community 3 - "Community 3"
Cohesion: 0.43
Nodes (6): checkRateLimit(), escapeHtml(), GET(), isValidEmail(), newIdempotencyKey(), POST()

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
Nodes (2): upload(), uploadFiles()

### Community 9 - "Community 9"
Cohesion: 0.4
Nodes (2): generateMetadata(), generateStaticParams()

### Community 13 - "Community 13"
Cohesion: 0.6
Nodes (3): refresh(), remove(), upload()

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (2): fadeUp(), GithubActivity()

### Community 15 - "Community 15"
Cohesion: 0.6
Nodes (3): estimateReadTime(), formatDate(), rowToPost()

### Community 16 - "Community 16"
Cohesion: 0.5
Nodes (1): " "()

## Knowledge Gaps
- **Thin community `Community 4`** (7 nodes): `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `Loading()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (6 nodes): `FormFields.tsx`, `move()`, `remove()`, `removeAt()`, `upload()`, `uploadFiles()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (6 nodes): `page.tsx`, `page.tsx`, `BlogDetailPage()`, `generateMetadata()`, `generateStaticParams()`, `ProjectDetailPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (5 nodes): `GithubActivity.tsx`, `buildStreakUrl()`, `fadeUp()`, `GithubActivity()`, `GithubMark()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (4 nodes): `page.tsx`, `LoginForm.tsx`, `" "()`, `LoginPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 0` to `Community 8`, `Community 3`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `add()` connect `Community 2` to `Community 8`, `Community 6`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `createClient()` (e.g. with `signInWithMagicLink()` and `signOut()`) actually correct?**
  _`createClient()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `isSupabaseConfigured()` (e.g. with `AdminMediaPage()` and `AdminCategoriesPage()`) actually correct?**
  _`isSupabaseConfigured()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `GET()` (e.g. with `signInWithMagicLink()` and `updateSession()`) actually correct?**
  _`GET()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._