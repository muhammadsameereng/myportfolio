-- =====================================================================
-- Saran Zafar — admin schema
-- Paste this entire file into Supabase → SQL Editor → New query → Run.
-- Idempotent: safe to re-run.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1) Tables
-- ---------------------------------------------------------------------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  color text,
  kind text not null check (kind in ('project', 'blog')),
  created_at timestamptz not null default now(),
  unique (slug, kind)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  long_description text,
  category_id uuid references public.categories(id) on delete set null,
  tags text[] not null default '{}',
  thumb_url text,
  gallery_urls text[] not null default '{}',
  year int,
  role text,
  live_url text,
  repo_url text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Idempotent column add for existing installations.
alter table public.projects
  add column if not exists gallery_urls text[] not null default '{}';

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text,
  date date,
  read_time text,
  thumb_url text,
  tags text[] not null default '{}',
  category_id uuid references public.categories(id) on delete set null,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to keep `updated_at` fresh on every update.
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end
$$ language plpgsql;

drop trigger if exists projects_updated on public.projects;
create trigger projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists blog_posts_updated on public.blog_posts;
create trigger blog_posts_updated before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- Helpful indexes
create index if not exists projects_status_published_at_idx
  on public.projects (status, published_at desc);
create index if not exists projects_featured_idx
  on public.projects (featured) where status = 'published';
create index if not exists blog_status_date_idx
  on public.blog_posts (status, date desc);
create index if not exists blog_featured_idx
  on public.blog_posts (featured) where status = 'published';

-- ---------------------------------------------------------------------
-- 2) Storage bucket for media
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 3) Row-level security
--
-- IMPORTANT: replace the email list in the `is_admin()` function below
-- with your real admin emails.  Keep this list in sync with the
-- ADMIN_EMAILS env var consumed by the Next.js app.
-- ---------------------------------------------------------------------

create or replace function public.is_admin() returns boolean as $$
declare
  email text;
begin
  email := lower(coalesce(auth.jwt() ->> 'email', ''));
  return email in (
    -- ⬇️  EDIT THIS LIST  ⬇️
    'saran.development@gmail.com'
  );
end
$$ language plpgsql stable security definer;

-- Categories
alter table public.categories enable row level security;

drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read" on public.categories
  for select using (true);

drop policy if exists "categories: admin write" on public.categories;
create policy "categories: admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- Projects
alter table public.projects enable row level security;

drop policy if exists "projects: public read published" on public.projects;
create policy "projects: public read published" on public.projects
  for select using (status = 'published' or public.is_admin());

drop policy if exists "projects: admin write" on public.projects;
create policy "projects: admin write" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

-- Blog posts
alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts: public read published" on public.blog_posts;
create policy "blog_posts: public read published" on public.blog_posts
  for select using (status = 'published' or public.is_admin());

drop policy if exists "blog_posts: admin write" on public.blog_posts;
create policy "blog_posts: admin write" on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- Storage policies — public read, admin write
drop policy if exists "media: public read" on storage.objects;
create policy "media: public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media: admin write" on storage.objects;
create policy "media: admin write" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admin update" on storage.objects;
create policy "media: admin update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admin delete" on storage.objects;
create policy "media: admin delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------------
-- 4) AI blog pipeline — job queue / resumable state machine
--
-- Drives the "Generate with AI" flow: one row per generation job. Each
-- stage persists its output column AND advances `stage` before the next
-- runs, so an interrupted job resumes from exactly where it stopped.
-- Admin-only (no public read).
-- ---------------------------------------------------------------------

create table if not exists public.blog_jobs (
  id             uuid primary key default gen_random_uuid(),
  topic          text not null,
  angle          text not null default '',
  depth          text not null default 'standard',   -- short | standard | deep
  status         text not null default 'pending'
                   check (status in ('pending','processing','done','error')),
  stage          text not null default 'research'
                   check (stage in ('research','outline','draft','metadata','image','save','complete')),
  -- per-stage persisted outputs (resumability):
  research_notes text,
  outline        text,
  draft_md       text,
  metadata_json  jsonb,
  thumb_url      text,
  post_id        uuid references public.blog_posts(id) on delete set null,  -- idempotency guard
  -- resilience / observability:
  attempts       int not null default 0,
  locked_at      timestamptz,
  error          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists blog_jobs_status_idx
  on public.blog_jobs (status, updated_at desc);

drop trigger if exists blog_jobs_updated on public.blog_jobs;
create trigger blog_jobs_updated before update on public.blog_jobs
  for each row execute function public.set_updated_at();

alter table public.blog_jobs enable row level security;

drop policy if exists "blog_jobs: admin all" on public.blog_jobs;
create policy "blog_jobs: admin all" on public.blog_jobs
  for all using (public.is_admin()) with check (public.is_admin());
