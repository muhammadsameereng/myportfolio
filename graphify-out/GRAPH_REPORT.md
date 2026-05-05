# Graph Report - portfolio  (2026-05-06)

## Corpus Check
- 119 files · ~88,690 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 318 nodes · 288 edges · 14 communities detected
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 16 edges
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
- `createClient()` --calls--> `main()`  [INFERRED]
  app/lib/supabase/client.ts → scripts/add-saranzafar-tag.ts
- `add()` --calls--> `main()`  [INFERRED]
  app/components/admin/FormFields.tsx → scripts/seed-csv-projects.ts
- `signInWithMagicLink()` --calls--> `createClient()`  [INFERRED]
  app/admin/actions.ts → app/lib/supabase/client.ts
- `signOut()` --calls--> `createClient()`  [INFERRED]
  app/admin/actions.ts → app/lib/supabase/client.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (17): signInWithMagicLink(), signOut(), getAdminEmails(), isAdminEmail(), AdminLayout(), updateSession(), proxy(), safeNextPath() (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.14
Nodes (14): clean(), deleteBlogPost(), deleteCategory(), deleteProject(), saveBlogPost(), saveCategory(), saveProject(), slugify() (+6 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (9): add(), remove(), main(), parseBool(), parseCSV(), parseJsonArray(), slugify(), applyTheme() (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (9): AdminBlogList(), AdminCategoriesPage(), AdminMediaPage(), AdminProjectsList(), EditBlogPostPage(), EditProjectPage(), NewBlogPostPage(), NewProjectPage() (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (7): FlowDiagram(), FlowToken(), pathBetween(), pos(), MemorySection(), Stack(), useTooltip()

### Community 5 - "Community 5"
Cohesion: 0.36
Nodes (6): clipToRect(), DeepDrawer(), edgePath(), Graph(), nodeById(), usePanZoom()

### Community 6 - "Community 6"
Cohesion: 0.38
Nodes (4): clipToRect(), edgePath(), Graph(), usePanZoom()

### Community 7 - "Community 7"
Cohesion: 0.29
Nodes (1): Loading()

### Community 9 - "Community 9"
Cohesion: 0.47
Nodes (3): fadeUp(), Para(), SectionTitle()

### Community 10 - "Community 10"
Cohesion: 0.4
Nodes (2): generateMetadata(), generateStaticParams()

### Community 16 - "Community 16"
Cohesion: 0.6
Nodes (3): refresh(), remove(), upload()

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (2): fadeUp(), GithubActivity()

### Community 18 - "Community 18"
Cohesion: 0.6
Nodes (3): estimateReadTime(), formatDate(), rowToPost()

### Community 20 - "Community 20"
Cohesion: 0.5
Nodes (1): " "()

## Knowledge Gaps
- **Thin community `Community 7`** (7 nodes): `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `Loading()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (6 nodes): `page.tsx`, `page.tsx`, `BlogDetailPage()`, `generateMetadata()`, `generateStaticParams()`, `ProjectDetailPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (5 nodes): `GithubActivity.tsx`, `buildStreakUrl()`, `fadeUp()`, `GithubActivity()`, `GithubMark()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (4 nodes): `page.tsx`, `LoginForm.tsx`, `" "()`, `LoginPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `add()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `GET()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `createClient()` (e.g. with `signInWithMagicLink()` and `signOut()`) actually correct?**
  _`createClient()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `GET()` (e.g. with `signInWithMagicLink()` and `getSiteOrigin()`) actually correct?**
  _`GET()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `isSupabaseConfigured()` (e.g. with `AdminMediaPage()` and `AdminCategoriesPage()`) actually correct?**
  _`isSupabaseConfigured()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `signInWithMagicLink()` (e.g. with `GET()` and `safeNextPath()`) actually correct?**
  _`signInWithMagicLink()` has 5 INFERRED edges - model-reasoned connections that need verification._