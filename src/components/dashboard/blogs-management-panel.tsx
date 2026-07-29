"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Pencil, PlusCircle, Trash2, X } from "lucide-react";
import { useToast } from "@/components/shared/toast";
import {
  deleteDashboardBlog,
  listDashboardBlogs,
  updateDashboardBlogStatus,
} from "@/lib/dashboard-blogs/storage";
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

type DeleteBlogModalProps = {
  blog: DashboardBlog | null;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteBlogModal({ blog, onClose, onConfirm }: DeleteBlogModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!blog) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [blog, onClose]);

  return (
    <AnimatePresence>
      {blog ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close delete confirmation"
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-logo-bg/50 hover:bg-black/[0.04] hover:text-logo-bg"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 id={titleId} className="text-lg font-bold text-logo-bg">
              Delete blog?
            </h2>
            <p className="mt-2 text-sm text-foreground/60">
              This removes <strong>{blog.title}</strong> from the dashboard
              list. This action cannot be undone in the current mock storage.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-black/15 px-4 py-2.5 text-sm font-semibold text-logo-bg hover:bg-black/[0.03]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function BlogsManagementPanel() {
  const router = useRouter();
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<DashboardBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogToDelete, setBlogToDelete] = useState<DashboardBlog | null>(null);

  function loadBlogs() {
    setIsLoading(true);
    try {
      // TODO(integrate): fetch from real blogs API instead of mock storage.
      setBlogs(listDashboardBlogs());
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  function handleConfirmDelete() {
    if (!blogToDelete) return;
    deleteDashboardBlog(blogToDelete.id);
    showToast("Blog deleted.");
    setBlogToDelete(null);
    loadBlogs();
  }

  function handleStatusChange(blogId: string, status: BlogStatus) {
    updateDashboardBlogStatus(blogId, status);
    showToast("Blog status updated.");
    loadBlogs();
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

    return { totalBlogs, publishedCount, draftCount, totalViews, highestViewedBlog };
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
          Overview of blog activity and quick actions for managing blog content.
          Data is stored locally in this browser until backend integration.
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
          hint="Mock view counts"
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
            className="inline-flex items-center gap-2 rounded-lg bg-logo-bg px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-logo-bg/90"
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
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-logo-bg"
              >
                <PlusCircle size={16} />
                Create your first blog
              </button>
            </div>
          ) : (
            blogs.map((blog) => (
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
                      unoptimized={blog.coverImageUrl.startsWith("data:")}
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
                      {blog.viewsCount.toLocaleString()} views
                    </p>
                    <select
                      value={blog.status}
                      onChange={(event) =>
                        handleStatusChange(
                          blog.id,
                          event.target.value as BlogStatus,
                        )
                      }
                      className="rounded-md border border-black/15 px-2 py-1 text-xs font-semibold text-logo-bg outline-none focus:border-primary"
                      aria-label={`Change status for ${blog.title}`}
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="PUBLISHED">PUBLISHED</option>
                    </select>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/tb-dashboard/blogs/${blog.id}`)
                      }
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-black/15 px-3 py-2 text-xs font-semibold text-logo-bg hover:bg-black/[0.03]"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlogToDelete(blog)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <DeleteBlogModal
        blog={blogToDelete}
        onClose={() => setBlogToDelete(null)}
        onConfirm={handleConfirmDelete}
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
