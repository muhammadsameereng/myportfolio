import {
  AlertCircle,
  ArrowRight,
  FileText,
  FolderKanban,
  Plus,
  Star,
  Tags,
} from "lucide-react";
import Link from "next/link";
import {
  EmptyState,
  FeaturedStar,
  PageHeader,
  PrimaryButton,
  StatCard,
  StatusBadge,
} from "@/app/components/admin/AdminPrimitives";
import {
  isSupabaseConfigured,
  SupabaseSetupPanel,
} from "@/app/components/admin/SupabaseGuard";
import { getCounts, getDashboardRecents } from "@/app/lib/admin/data";
import type { DashboardRecent } from "@/app/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!isSupabaseConfigured()) return <SupabaseSetupPanel />;

  const [counts, recents] = await Promise.all([
    getCounts(),
    getDashboardRecents(),
  ]);
  if (!counts || !recents) return <SupabaseSetupPanel />;

  const totalDrafts = counts.projects.drafts + counts.blog.drafts;
  const totalFeatured = counts.projects.featured + counts.blog.featured;
  const isEmpty = counts.projects.total === 0 && counts.blog.total === 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An at-a-glance overview of your projects, blog posts, and categories."
        actions={
          <PrimaryButton href="/admin/projects/new">
            <Plus size={13} />
            New project
          </PrimaryButton>
        }
      />

      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Projects"
            value={counts.projects.total}
            hint={`${counts.projects.published} published · ${counts.projects.drafts} drafts`}
            icon={<FolderKanban size={15} strokeWidth={1.8} />}
            href="/admin/projects"
          />
          <StatCard
            label="Blog posts"
            value={counts.blog.total}
            hint={`${counts.blog.published} published · ${counts.blog.drafts} drafts`}
            icon={<FileText size={15} strokeWidth={1.8} />}
            href="/admin/blog"
          />
          <StatCard
            label="Featured"
            value={totalFeatured}
            hint={`${counts.projects.featured} projects · ${counts.blog.featured} posts`}
            icon={<Star size={15} strokeWidth={1.8} />}
          />
          <StatCard
            label="Categories"
            value={counts.categories}
            hint="Across projects + blog"
            icon={<Tags size={15} strokeWidth={1.8} />}
            href="/admin/categories"
          />
        </div>

        {/* Drafts callout — only when there are drafts to act on */}
        {totalDrafts > 0 && (
          <Link
            href={
              counts.projects.drafts > 0 ? "/admin/projects" : "/admin/blog"
            }
            className="group mt-6 flex items-center gap-3 rounded-2xl border border-amber-300/60 bg-amber-50/70 px-4 py-3 transition-colors hover:border-amber-400 hover:bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
              <AlertCircle size={15} strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">
                {totalDrafts} {totalDrafts === 1 ? "draft" : "drafts"} waiting
                to be published
              </p>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                {counts.projects.drafts > 0 &&
                  `${counts.projects.drafts} project ${counts.projects.drafts === 1 ? "draft" : "drafts"}`}
                {counts.projects.drafts > 0 && counts.blog.drafts > 0 && " · "}
                {counts.blog.drafts > 0 &&
                  `${counts.blog.drafts} blog ${counts.blog.drafts === 1 ? "draft" : "drafts"}`}
              </p>
            </div>
            <ArrowRight
              size={14}
              className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        )}

        {/* Recent activity — two columns */}
        {!isEmpty && (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentList
              title="Recent projects"
              kind="project"
              items={recents.projects}
              viewAllHref="/admin/projects"
              newHref="/admin/projects/new"
            />
            <RecentList
              title="Recent blog posts"
              kind="blog"
              items={recents.blog}
              viewAllHref="/admin/blog"
              newHref="/admin/blog/new"
            />
          </div>
        )}

        {/* Quick actions */}
        <div className="mt-10">
          <h2 className="text-[14px] font-semibold tracking-tight text-foreground">
            Quick actions
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <QuickAction
              href="/admin/projects/new"
              icon={<FolderKanban size={15} strokeWidth={1.8} />}
              title="New project"
              description="Add a new case study or portfolio entry"
            />
            <QuickAction
              href="/admin/blog/new"
              icon={<FileText size={15} strokeWidth={1.8} />}
              title="New blog post"
              description="Write a new article or short note"
            />
            <QuickAction
              href="/admin/categories"
              icon={<Tags size={15} strokeWidth={1.8} />}
              title="Manage categories"
              description="Organise the taxonomy used across the site"
            />
          </div>
        </div>

        {isEmpty && (
          <div className="mt-10">
            <EmptyState
              icon={<FolderKanban size={20} strokeWidth={1.6} />}
              title="Nothing here yet"
              description="Start by creating your first project or blog post — they'll publish to the public site instantly."
              action={{ label: "Create a project", href: "/admin/projects/new" }}
            />
          </div>
        )}
      </div>
    </>
  );
}

function RecentList({
  title,
  kind,
  items,
  viewAllHref,
  newHref,
}: {
  title: string;
  kind: "project" | "blog";
  items: DashboardRecent[];
  viewAllHref: string;
  newHref: string;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ArrowRight
            size={11}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-[12.5px] text-muted-foreground">
            No {kind === "project" ? "projects" : "blog posts"} yet
          </p>
          <Link
            href={newHref}
            className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-medium text-foreground hover:underline"
          >
            <Plus size={11} />
            Create the first one
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/admin/${kind === "project" ? "projects" : "blog"}/${item.id}`}
                className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-foreground/[0.03]"
              >
                <FeaturedStar featured={item.featured} size={12} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">
                    {item.title || (
                      <span className="text-muted-foreground">Untitled</span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    /{item.slug || "—"} · updated {formatRelative(item.updated_at)}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatRelative(iso: string): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Date.now() - then;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      new Date(iso).getFullYear() === new Date().getFullYear()
        ? undefined
        : "numeric",
  });
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/30"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.05] text-foreground/75 transition-colors group-hover:bg-foreground/[0.08] group-hover:text-foreground">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-[12.5px] text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
