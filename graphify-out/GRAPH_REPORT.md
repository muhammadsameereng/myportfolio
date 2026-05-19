# Graph Report - portfolio  (2026-05-20)

## Corpus Check
- 127 files · ~94,908 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 349 nodes · 334 edges · 18 communities detected
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 59 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 24|Community 24]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 16 edges
2. `GET()` - 12 edges
3. `POST()` - 11 edges
4. `isSupabaseConfigured()` - 9 edges
5. `buildVariableSuffix()` - 8 edges
6. `signInWithMagicLink()` - 6 edges
7. `Loading()` - 6 edges
8. `isAdminEmail()` - 6 edges
9. `updateSession()` - 6 edges
10. `main()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [INFERRED]
  proxy.ts → app/lib/supabase/middleware.ts
- `add()` --calls--> `main()`  [INFERRED]
  app/components/admin/FormFields.tsx → scripts/seed-csv-projects.ts
- `createClient()` --calls--> `main()`  [INFERRED]
  app/lib/supabase/client.ts → scripts/add-saranzafar-tag.ts
- `getValidSlugs()` --calls--> `POST()`  [INFERRED]
  app/lib/agent/system-prompt.ts → app/api/chat/send-email/route.ts
- `signInWithMagicLink()` --calls--> `createClient()`  [INFERRED]
  app/admin/actions.ts → app/lib/supabase/client.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (14): signInWithMagicLink(), signOut(), getAdminEmails(), isAdminEmail(), AdminLayout(), updateSession(), proxy(), getClientIp() (+6 more)

### Community 1 - "Community 1"
Cohesion: 0.14
Nodes (14): clean(), deleteBlogPost(), deleteCategory(), deleteProject(), saveBlogPost(), saveCategory(), saveProject(), slugify() (+6 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (9): AdminBlogList(), AdminCategoriesPage(), AdminMediaPage(), AdminProjectsList(), EditBlogPostPage(), EditProjectPage(), NewBlogPostPage(), NewProjectPage() (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (7): FlowDiagram(), FlowToken(), pathBetween(), pos(), MemorySection(), Stack(), useTooltip()

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (4): add(), remove(), applyTheme(), setThemeExternal()

### Community 5 - "Community 5"
Cohesion: 0.24
Nodes (13): classifyIntent(), describeIntent(), renderExpandedPosts(), renderExpandedProjects(), score(), selectRelevantPosts(), selectRelevantProjects(), tokenize() (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (7): compactHistory(), isValidEmail(), jsonError(), POST(), escapeHtml(), newIdempotencyKey(), sendContactEmail()

### Community 7 - "Community 7"
Cohesion: 0.36
Nodes (6): clipToRect(), DeepDrawer(), edgePath(), Graph(), nodeById(), usePanZoom()

### Community 8 - "Community 8"
Cohesion: 0.38
Nodes (4): clipToRect(), edgePath(), Graph(), usePanZoom()

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (1): Loading()

### Community 11 - "Community 11"
Cohesion: 0.48
Nodes (5): main(), parseBool(), parseCSV(), parseJsonArray(), slugify()

### Community 12 - "Community 12"
Cohesion: 0.47
Nodes (3): fadeUp(), Para(), SectionTitle()

### Community 13 - "Community 13"
Cohesion: 0.4
Nodes (2): newId(), welcomeMessage()

### Community 14 - "Community 14"
Cohesion: 0.4
Nodes (2): generateMetadata(), generateStaticParams()

### Community 20 - "Community 20"
Cohesion: 0.6
Nodes (3): refresh(), remove(), upload()

### Community 21 - "Community 21"
Cohesion: 0.5
Nodes (2): fadeUp(), GithubActivity()

### Community 22 - "Community 22"
Cohesion: 0.6
Nodes (3): estimateReadTime(), formatDate(), rowToPost()

### Community 24 - "Community 24"
Cohesion: 0.5
Nodes (1): " "()

## Knowledge Gaps
- **Thin community `Community 9`** (7 nodes): `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `Loading()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (6 nodes): `ChatPanel.tsx`, `newId()`, `onKey()`, `parseMessage()`, `submit()`, `welcomeMessage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (6 nodes): `page.tsx`, `page.tsx`, `BlogDetailPage()`, `generateMetadata()`, `generateStaticParams()`, `ProjectDetailPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (5 nodes): `GithubActivity.tsx`, `buildStreakUrl()`, `fadeUp()`, `GithubActivity()`, `GithubMark()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (4 nodes): `page.tsx`, `LoginForm.tsx`, `" "()`, `LoginPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `GET()` connect `Community 0` to `Community 1`, `Community 6`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `add()` connect `Community 4` to `Community 1`, `Community 11`, `Community 5`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `createClient()` (e.g. with `signInWithMagicLink()` and `signOut()`) actually correct?**
  _`createClient()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `GET()` (e.g. with `signInWithMagicLink()` and `getSiteOrigin()`) actually correct?**
  _`GET()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `POST()` (e.g. with `getClientIp()` and `sendContactEmail()`) actually correct?**
  _`POST()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `isSupabaseConfigured()` (e.g. with `AdminMediaPage()` and `AdminCategoriesPage()`) actually correct?**
  _`isSupabaseConfigured()` has 8 INFERRED edges - model-reasoned connections that need verification._