"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/components/shared/toast";
import {
  deleteDashboardBlog,
  listDashboardBlogs,
  updateDashboardBlogStatus,
} from "@/lib/dashboard-blogs/storage";
import type { BlogStatus, DashboardBlog } from "@/lib/dashboard-blogs/types";

export function BlogsManagementPanel() {
  const router = useRouter();
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<DashboardBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  function handleDeleteBlog(blogId: string) {
    const confirmed = window.confirm("Delete this blog?");
    if (!confirmed) return;
    deleteDashboardBlog(blogId);
    showToast("Blog deleted.");
    loadBlogs();
  }

  function handleStatusChange(blogId: string, status: BlogStatus) {
    updateDashboardBlogStatus(blogId, status);
    showToast("Blog status updated.");
    loadBlogs();
  }

  const metrics = useMemo(() => {
    const totalBlogs = blogs.length;
    const totalViews = blogs.reduce((sum, blog) => sum + blog.viewsCount, 0);
    const highestViewedBlog = blogs.length
      ? blogs.reduce((prev, current) =>
          current.viewsCount > prev.viewsCount ? current : prev,
        )
      : null;

    return { totalBlogs, totalViews, highestViewedBlog };
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
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50">
            Blog Views
          </p>
          <p className="mt-2 text-3xl font-bold text-logo-bg">
            {metrics.totalViews.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50">
            No. of Blogs
          </p>
          <p className="mt-2 text-3xl font-bold text-logo-bg">
            {metrics.totalBlogs}
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50">
            Highest Viewed Blog
          </p>
          <p className="mt-2 text-base font-bold text-logo-bg">
            {metrics.highestViewedBlog?.title ?? "--"}
          </p>
          <p className="mt-1 text-sm text-foreground/55">
            {metrics.highestViewedBlog
              ? `${metrics.highestViewedBlog.viewsCount.toLocaleString()} views`
              : "No blog yet"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-logo-bg">Blogs List</p>
          <button
            type="button"
            onClick={() => router.push("/tb-dashboard/blogs/create-new")}
            className="inline-flex items-center gap-2 rounded-lg bg-logo-bg px-4 py-2 text-sm font-semibold text-white"
          >
            <PlusCircle size={16} />
            Create Blog
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <p className="text-sm text-foreground/55">Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <p className="text-sm text-foreground/55">
              No blogs yet. Create your first blog.
            </p>
          ) : (
            blogs.map((blog) => (
              <article
                key={blog.id}
                className="rounded-xl border border-black/10 p-4"
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
                ) : null}
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-foreground/50">
                  {blog.status}
                </p>
                <h3 className="mt-2 text-base font-semibold text-logo-bg">
                  {blog.title}
                </h3>
                <p className="mt-1 text-xs text-foreground/55">/{blog.slug}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
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
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
