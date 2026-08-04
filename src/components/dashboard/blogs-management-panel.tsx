"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useToast } from "@/components/shared/toast";
import type { BlogStatus, DashboardBlog } from "@/lib/dashboard-blogs/types";

function statusBadgeClass(status: BlogStatus) {
  return status === "PUBLISHED"
    ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20"
    : "bg-amber-100 text-amber-800 ring-1 ring-amber-600/20";
}

function BlogCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-black/10 p-4">
      <div className="mb-3 h-36 rounded-md bg-black/[0.06]" />
      <div className="h-3 w-16 rounded bg-black/[0.06]" />
      <div className="mt-3 h-5 w-3/4 rounded bg-black/[0.06]" />
      <div className="mt-2 h-3 w-1/2 rounded bg-black/[0.06]" />
      <div className="mt-4 h-8 rounded bg-black/[0.06]" />
    </div>
  );
}

export function BlogsManagementPanel() {
  const router = useRouter();
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<DashboardBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogToDelete, setBlogToDelete] = useState<DashboardBlog | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [busyBlogId, setBusyBlogId] = useState<string | null>(null);

  async function loadBlogs() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/dashboard/blogs");
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        blogs?: DashboardBlog[];
      };
      if (!response.ok || !data.ok) {
        showToast(data.error || "Could not load blogs.");
        setBlogs([]);
        return;
      }
      setBlogs(data.blogs ?? []);
    } catch {
      showToast("Could not load blogs.");
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  async function handleConfirmDelete() {
    if (!blogToDelete || deletePending) return;
    setDeletePending(true);
    try {
      const response = await fetch("/api/dashboard/blogs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId: blogToDelete.id }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        showToast(data.error || "Could not delete blog.");
        return;
      }
      showToast("Blog deleted.");
      setBlogToDelete(null);
      await loadBlogs();
    } catch {
      showToast("Could not delete blog.");
    } finally {
      setDeletePending(false);
    }
  }

  async function handleStatusChange(blogId: string, status: BlogStatus) {
    if (busyBlogId) return;
    setBusyBlogId(blogId);
    try {
      const response = await fetch("/api/dashboard/blogs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, status }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        blog?: DashboardBlog;
      };
      if (!response.ok || !data.ok || !data.blog) {
        showToast(data.error || "Could not update status.");
        return;
      }
      setBlogs((prev) =>
        prev.map((blog) => (blog.id === data.blog!.id ? data.blog! : blog)),
      );
      showToast("Blog status updated.");
    } catch {
      showToast("Could not update status.");
    } finally {
      setBusyBlogId(null);
    }
  }

  const metrics = useMemo(() => {
    const totalBlogs = blogs.length;
    const publishedCount = blogs.filter((b) => b.status === "PUBLISHED").length;
    const draftCount = totalBlogs - publishedCount;
    const totalViews = blogs.reduce((sum, blog) => sum + blog.viewsCount, 0);
    const highestViewedBlog = blogs.length
      ? blogs.reduce((prev, current) =>
          current.viewsCount > prev.viewsCount ? current : prev,
        )
      : null;

    return {
      totalBlogs,
      publishedCount,
      draftCount,
      totalViews,
      highestViewedBlog,
    };
  }, [blogs]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-dark">
          Blogs
        </p>
        <h1 className="mt-2 text-2xl font-bold text-logo-bg md:text-3xl">
          Blogs Management
        </h1>
        <p className="mt-3 text-sm text-foreground/55 md:text-base">
          Create, edit, and publish blogs. Images are stored as WebP and served
          via /api/images (no Vercel image optimization).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total blogs" value={String(metrics.totalBlogs)} />
        <MetricCard
          label="Published"
          value={String(metrics.publishedCount)}
          hint={`${metrics.draftCount} drafts`}
        />
        <MetricCard
          label="Total views"
          value={metrics.totalViews.toLocaleString()}
        />
        <MetricCard
          label="Top viewed"
          value={metrics.highestViewedBlog?.title ?? "—"}
          hint={
            metrics.highestViewedBlog
              ? `${metrics.highestViewedBlog.viewsCount.toLocaleString()} views`
              : "No blogs yet"
          }
        />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-logo-bg">Blogs List</p>
          <button
            type="button"
            onClick={() => router.push("/tb-dashboard/blogs/create-new")}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-logo-bg px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-logo-bg/90"
          >
            <PlusCircle size={16} />
            Create Blog
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <>
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </>
          ) : blogs.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-black/10 px-6 py-14 text-center">
              <p className="text-base font-semibold text-logo-bg">No blogs yet</p>
              <p className="mt-2 text-sm text-foreground/55">
                Create your first blog post with title, SEO fields, cover image,
                and rich body content.
              </p>
              <button
                type="button"
                onClick={() => router.push("/tb-dashboard/blogs/create-new")}
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-logo-bg"
              >
                <PlusCircle size={16} />
                Create your first blog
              </button>
            </div>
          ) : (
            blogs.map((blog) => {
              const isBusy = busyBlogId === blog.id;
              return (
                <article
                  key={blog.id}
                  className="flex flex-col rounded-xl border border-black/10 p-4 transition-shadow hover:shadow-md"
                >
                  {blog.coverImageUrl ? (
                    <div className="relative mb-3 h-36 overflow-hidden rounded-md">
                      <Image
                        src={blog.coverImageUrl}
                        alt={blog.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mb-3 flex h-36 items-center justify-center rounded-md bg-black/[0.04] text-xs font-medium text-foreground/40">
                      No cover image
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusBadgeClass(blog.status)}`}
                    >
                      {blog.status}
                    </span>
                    {blog.category ? (
                      <span className="text-xs text-foreground/50">
                        {blog.category}
                      </span>
                    ) : null}
                    {blog.dateLabel ? (
                      <span className="text-xs text-foreground/40">
                        {blog.dateLabel}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-2 line-clamp-2 text-base font-semibold text-logo-bg">
                    {blog.title}
                  </h3>
                  <p className="mt-1 truncate text-xs text-foreground/55">
                    /blog/{blog.slug}
                  </p>
                  {blog.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm text-foreground/60">
                      {blog.excerpt}
                    </p>
                  ) : null}

                  <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="inline-flex items-center gap-1 text-sm font-semibold text-logo-bg">
                        <Eye size={14} />
                        {(blog.viewsCount ?? 0).toLocaleString()} views
                      </p>
                      <select
                        value={blog.status}
                        disabled={isBusy}
                        onChange={(event) =>
                          void handleStatusChange(
                            blog.id,
                            event.target.value as BlogStatus,
                          )
                        }
                        className="cursor-pointer rounded-md border border-black/15 px-2 py-1 text-xs font-semibold text-logo-bg outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Change status for ${blog.title}`}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                      </select>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        disabled={isBusy || deletePending}
                        onClick={() =>
                          router.push(`/tb-dashboard/blogs/${blog.id}`)
                        }
                        className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md border border-black/15 px-3 py-2 text-xs font-semibold text-logo-bg hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={isBusy || deletePending}
                        onClick={() => setBlogToDelete(blog)}
                        className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(blogToDelete)}
        title="Delete blog?"
        description={
          blogToDelete
            ? `This permanently deletes “${blogToDelete.title}” from the server.`
            : ""
        }
        confirmLabel="Delete"
        pending={deletePending}
        onClose={() => {
          if (!deletePending) setBlogToDelete(null);
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50">
        {label}
      </p>
      <p className="mt-2 line-clamp-2 text-2xl font-bold text-logo-bg">{value}</p>
      {hint ? (
        <p className="mt-1 text-sm text-foreground/55">{hint}</p>
      ) : null}
    </div>
  );
}
