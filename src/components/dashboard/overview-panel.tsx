"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  FilePlus2,
  FileText,
  Inbox,
  UserPlus,
  Users,
} from "lucide-react";
import type { DashboardBlog } from "@/lib/dashboard-blogs/types";
import { MOCK_USERS } from "@/lib/dashboard-users/mock-users";
import { siteConfig } from "@/config/site";

type OverviewPanelProps = {
  leadCount: number;
  recentLeadLabels: string[];
};

type DockItem = {
  href: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const DOCK_ITEMS: DockItem[] = [
  {
    href: "/tb-dashboard/blogs/create-new",
    label: "Create blog",
    hint: "New post",
    icon: FilePlus2,
  },
  {
    href: "/tb-dashboard/leads",
    label: "Leads",
    hint: "Inbox",
    icon: Inbox,
  },
  {
    href: "/tb-dashboard/users",
    label: "Users",
    hint: "Accounts",
    icon: UserPlus,
  },
];

export function OverviewPanel({
  leadCount,
  recentLeadLabels,
}: OverviewPanelProps) {
  const [blogCount, setBlogCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadBlogStats() {
      try {
        const response = await fetch("/api/dashboard/blogs");
        const data = (await response.json()) as {
          ok?: boolean;
          blogs?: DashboardBlog[];
        };
        if (cancelled || !response.ok || !data.ok) return;
        const blogs = data.blogs ?? [];
        setBlogCount(blogs.length);
        setPublishedCount(blogs.filter((b) => b.status === "PUBLISHED").length);
        setDraftCount(blogs.filter((b) => b.status === "DRAFT").length);
      } catch {
        // Keep zeros on failure
      }
    }
    void loadBlogStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const userCount = MOCK_USERS.length;

  const summaryLine = useMemo(() => {
    return `${siteConfig.name} dashboard — leads, content, users, and site insights in one place.`;
  }, []);

  return (
    <div className="relative space-y-6 pb-28">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-logo-bg/50">
          Overview
        </p>
        <h2 className="mt-1 text-xl font-extrabold text-logo-bg sm:text-2xl">
          Welcome back
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-foreground/55">{summaryLine}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Website leads"
          value={String(leadCount)}
          hint="Captured from forms"
          href="/tb-dashboard/leads"
          icon={Inbox}
        />
        <StatCard
          label="Blog posts"
          value={String(blogCount)}
          hint={`${publishedCount} published · ${draftCount} draft`}
          href="/tb-dashboard/blogs"
          icon={FileText}
        />
        <StatCard
          label="Users"
          value={String(userCount)}
          hint="Dashboard accounts"
          href="/tb-dashboard/users"
          icon={Users}
        />
        <StatCard
          label="Analytics"
          value="Live"
          hint="Traffic & conversions"
          href="/tb-dashboard/website-analytics"
          icon={BarChart3}
        />
      </div>

      <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-base font-extrabold text-logo-bg">At a glance</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60">
          Monitor inbound demand from the public site, publish blog content,
          manage who can access this dashboard, and review website analytics
          (including Microsoft Clarity) to improve pages that drive quotes.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <GlanceLink
            href="/tb-dashboard/leads"
            title="Leads inbox"
            text={
              leadCount > 0
                ? recentLeadLabels.length
                  ? `Latest: ${recentLeadLabels.slice(0, 2).join(", ")}`
                  : `${leadCount} total submissions`
                : "No stored leads yet — new form submits will appear here."
            }
          />
          <GlanceLink
            href="/tb-dashboard/blogs"
            title="Content"
            text={`${publishedCount} live · ${draftCount} drafts ready to edit or publish.`}
          />
          <GlanceLink
            href="/tb-dashboard/website-analytics"
            title="Site performance"
            text="Locale mix, service demand, CTAs, and Clarity UX checks."
          />
        </div>
      </section>

      {/* Shortcut dock */}
      <nav
        aria-label="Quick shortcuts"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-20 flex justify-center px-4 lg:left-72"
      >
        <div className="pointer-events-auto flex items-end gap-1 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-xl backdrop-blur-md sm:gap-2 sm:p-2.5">
          {DOCK_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-w-[4.5rem] flex-col items-center gap-1 rounded-xl px-3 py-2 text-logo-bg transition-colors hover:bg-primary/15 sm:min-w-[5.5rem]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-logo-bg text-white shadow-sm transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-[11px] font-bold leading-tight">
                  {item.label}
                </span>
                <span className="hidden text-[10px] text-foreground/45 sm:block">
                  {item.hint}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  href,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-colors hover:border-primary/40"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50">
          {label}
        </p>
        <Icon className="h-4 w-4 text-primary-dark" aria-hidden />
      </div>
      <p className="mt-2 text-3xl font-bold text-logo-bg">{value}</p>
      <p className="mt-1 text-xs text-foreground/50">{hint}</p>
    </Link>
  );
}

function GlanceLink({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-black/10 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <p className="text-sm font-bold text-logo-bg">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-foreground/55">{text}</p>
    </Link>
  );
}
