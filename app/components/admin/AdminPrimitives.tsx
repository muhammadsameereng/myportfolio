"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

/* ── Page header with breadcrumb-style back link + actions ────────────── */
export function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: string;
  back?: { label: string; href: string };
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border bg-background/85 px-6 py-6 backdrop-blur md:px-10 md:py-7">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {back && (
            <Link
              href={back.href}
              className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft
                size={13}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              {back.label}
            </Link>
          )}
          <h1 className="mt-2 text-[26px] font-bold tracking-tight text-foreground sm:text-[28px]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}

/* ── Status badge ────────────────────────────────────────────────────── */
export function StatusBadge({ status }: { status: "draft" | "published" }) {
  if (status === "published") {
    return (
      <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-emerald-500/12 px-2.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-foreground/75">
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/45" />
      Draft
    </span>
  );
}

/* ── Featured star toggle ────────────────────────────────────────────── */
export function FeaturedStar({
  featured,
  onToggle,
  size = 14,
}: {
  featured: boolean;
  onToggle?: () => void;
  size?: number;
}) {
  const Icon = (
    <Star
      size={size}
      strokeWidth={1.8}
      className={
        featured
          ? "fill-amber-400 text-amber-400"
          : "text-muted-foreground/60 group-hover:text-foreground"
      }
      fill={featured ? "currentColor" : "none"}
    />
  );

  if (!onToggle) return Icon;

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.85 }}
      className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-foreground/[0.06]"
      aria-label={featured ? "Unfeature" : "Feature this item"}
      title={featured ? "Featured — click to unfeature" : "Click to feature"}
    >
      {Icon}
    </motion.button>
  );
}

/* ── Buttons ─────────────────────────────────────────────────────────── */
export function PrimaryButton({
  children,
  href,
  type = "button",
  disabled,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const cls = `inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 text-[12.5px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  href,
  type = "button",
  disabled,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const cls = `inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background px-4 text-[12.5px] font-medium text-foreground transition-colors duration-200 hover:border-foreground/40 hover:bg-card disabled:cursor-not-allowed disabled:opacity-50 ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  type = "button",
  disabled,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const cls = `inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-4 text-[12.5px] font-medium text-rose-700 transition-colors duration-200 hover:border-rose-400 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-950/60 ${className}`;
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/* ── Empty state ──────────────────────────────────────────────────────
   Icon is accepted as rendered JSX (ReactNode), not a component type, so
   this can be safely passed across the server→client boundary. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/[0.06] text-muted-foreground">
        {icon}
      </span>
      <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && (
        <Link
          href={action.href}
          className="group mt-6 inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-[12.5px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
        >
          {action.label}
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}

/* ── Stat card ──────────────────────────────────────────────────────── */
export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
  href?: string;
}) {
  const Inner = (
    <motion.div
      whileHover={{ y: -3 }}
      className="group h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
    >
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/[0.05] text-foreground/75 transition-colors group-hover:bg-foreground/[0.08] group-hover:text-foreground">
          {icon}
        </span>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-4 text-[28px] font-semibold leading-none tracking-tight tabular-nums text-foreground sm:text-[30px]">
        {value}
      </p>
      {hint && (
        <p className="mt-2 text-[11.5px] text-muted-foreground">{hint}</p>
      )}
    </motion.div>
  );
  return href ? <Link href={href}>{Inner}</Link> : Inner;
}
