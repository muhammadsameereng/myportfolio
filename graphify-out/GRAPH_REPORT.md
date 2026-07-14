# Graph Report - portfolio  (2026-06-20)

## Corpus Check
- 137 files · ~100,489 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 399 nodes · 430 edges · 18 communities detected
- Extraction: 78% EXTRACTED · 22% INFERRED · 0% AMBIGUOUS · INFERRED: 94 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 18 edges
2. `POST()` - 16 edges
3. `GET()` - 13 edges
4. `isSupabaseConfigured()` - 10 edges
5. `generateOnce()` - 9 edges
6. `isAdminEmail()` - 8 edges
7. `buildVariableSuffix()` - 8 edges
8. `main()` - 7 edges
9. `signInWithMagicLink()` - 6 edges
10. `adminClient()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [INFERRED]
  proxy.ts → app/lib/supabase/middleware.ts
- `createClient()` --calls--> `main()`  [INFERRED]
  app/lib/supabase/client.ts → scripts/add-saranzafar-tag.ts
- `add()` --calls--> `main()`  [INFERRED]
  app/components/admin/FormFields.tsx → scripts/seed-csv-projects.ts
- `tokenize()` --calls--> `has()`  [INFERRED]
  app/lib/agent/retrieval.ts → scripts/watch-blog-jobs.mjs
- `score()` --calls--> `has()`  [INFERRED]
  app/lib/agent/retrieval.ts → scripts/watch-blog-jobs.mjs

## Communities

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (27): assertConfig(), getPipelineConfig(), interpolate(), isNum(), isStr(), loadExamples(), PipelineConfigError, req() (+19 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (10): send(), handleSubmit(), compactHistory(), isValidEmail(), json(), jsonError(), POST(), escapeHtml() (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (14): signInWithMagicLink(), signOut(), getAdminEmails(), isAdminEmail(), AdminLayout(), updateSession(), proxy(), getClientIp() (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (14): clean(), deleteBlogPost(), deleteCategory(), deleteProject(), saveBlogPost(), saveCategory(), saveProject(), slugify() (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (9): add(), remove(), main(), parseBool(), parseCSV(), parseJsonArray(), slugify(), applyTheme() (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.1
Nodes (10): AdminBlogList(), AdminCategoriesPage(), AdminMediaPage(), AdminProjectsList(), EditBlogPostPage(), EditProjectPage(), GenerateBlogPage(), NewBlogPostPage() (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.19
Nodes (14): classifyIntent(), describeIntent(), renderExpandedPosts(), renderExpandedProjects(), score(), selectRelevantPosts(), selectRelevantProjects(), tokenize() (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (7): FlowDiagram(), FlowToken(), pathBetween(), pos(), MemorySection(), Stack(), useTooltip()

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (9): adminClient(), createBlogJob(), getRecentJobs(), resumeJob(), resume(), submit(), refresh(), remove() (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.36
Nodes (6): clipToRect(), DeepDrawer(), edgePath(), Graph(), nodeById(), usePanZoom()

### Community 10 - "Community 10"
Cohesion: 0.38
Nodes (4): clipToRect(), edgePath(), Graph(), usePanZoom()

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (1): Loading()

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
Cohesion: 0.5
Nodes (2): fadeUp(), GithubActivity()

### Community 21 - "Community 21"
Cohesion: 0.6
Nodes (3): estimateReadTime(), formatDate(), rowToPost()

### Community 22 - "Community 22"
Cohesion: 0.5
Nodes (1): " "()

## Knowledge Gaps
- **Thin community `Community 11`** (7 nodes): `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `loading.tsx`, `Loading()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (6 nodes): `ChatPanel.tsx`, `newId()`, `onKey()`, `parseMessage()`, `submit()`, `welcomeMessage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (6 nodes): `page.tsx`, `page.tsx`, `BlogDetailPage()`, `generateMetadata()`, `generateStaticParams()`, `ProjectDetailPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (5 nodes): `GithubActivity.tsx`, `buildStreakUrl()`, `fadeUp()`, `GithubActivity()`, `GithubMark()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (4 nodes): `page.tsx`, `LoginForm.tsx`, `" "()`, `LoginPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 3` to `Community 8`, `Community 1`, `Community 2`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `POST()` connect `Community 1` to `Community 0`, `Community 2`, `Community 3`, `Community 6`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `adminClient()` connect `Community 8` to `Community 2`, `Community 3`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 17 inferred relationships involving `createClient()` (e.g. with `signInWithMagicLink()` and `signOut()`) actually correct?**
  _`createClient()` has 17 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `POST()` (e.g. with `getClientIp()` and `sendContactEmail()`) actually correct?**
  _`POST()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `GET()` (e.g. with `signInWithMagicLink()` and `getSiteOrigin()`) actually correct?**
  _`GET()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `isSupabaseConfigured()` (e.g. with `AdminMediaPage()` and `AdminCategoriesPage()`) actually correct?**
  _`isSupabaseConfigured()` has 9 INFERRED edges - model-reasoned connections that need verification._