"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, ImagePlus, Save } from "lucide-react";
import { useToast } from "@/components/shared/toast";
import {
  blogSlugHint,
  isValidBlogSlug,
  slugifyBlogTitle,
} from "@/lib/dashboard-blogs/helpers";
import {
  addDashboardBlogImage,
  createDashboardBlog,
  getDashboardBlogById,
  listDashboardBlogImages,
  updateDashboardBlog,
} from "@/lib/dashboard-blogs/storage";
import type {
  BlogImageAsset,
  BlogStatus,
} from "@/lib/dashboard-blogs/types";

const BlogBodyEditor = dynamic(
  () => import("@/components/dashboard/blog-body-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[280px] rounded-lg border border-black/15 px-3 py-3 text-sm text-foreground/55">
        Loading editor...
      </div>
    ),
  },
);

const inputClassName =
  "rounded-lg border border-black/15 px-4 py-2 text-sm text-logo-bg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

type BlogEditorPanelProps = {
  blogId?: string;
};

function resetBlogForm(setters: {
  setBlogTitle: (v: string) => void;
  setBlogSlug: (v: string) => void;
  setBlogExcerpt: (v: string) => void;
  setBlogCategory: (v: string) => void;
  setBlogDate: (v: string) => void;
  setBlogStatus: (v: BlogStatus) => void;
  setSeoTitle: (v: string) => void;
  setSeoDescription: (v: string) => void;
  setBodyHtml: (v: string) => void;
  setSelectedImageUrl: (v: string | null) => void;
}) {
  setters.setBlogTitle("");
  setters.setBlogSlug("");
  setters.setBlogExcerpt("");
  setters.setBlogCategory("");
  setters.setBlogDate("");
  setters.setBlogStatus("DRAFT");
  setters.setSeoTitle("");
  setters.setSeoDescription("");
  setters.setBodyHtml("");
  setters.setSelectedImageUrl(null);
}

/**
 * Shared create + edit UI (same layout as Time Zone CreateNewBlogPanel).
 * Create: /tb-dashboard/blogs/create-new
 * Edit:   /tb-dashboard/blogs/[id]
 */
export function BlogEditorPanel({ blogId }: BlogEditorPanelProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const isEditMode = Boolean(blogId);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);
  const [images, setImages] = useState<BlogImageAsset[]>([]);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [blogDate, setBlogDate] = useState("");
  const [blogStatus, setBlogStatus] = useState<BlogStatus>("DRAFT");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const slugIsValid = isValidBlogSlug(blogSlug);
  const slugHint = blogSlugHint(blogSlug);
  const previewSlug = blogSlug.trim() || slugifyBlogTitle(blogTitle);

  useEffect(() => {
    setIsLoading(true);
    try {
      const loadedImages = listDashboardBlogImages();
      setImages(loadedImages);

      if (blogId) {
        const blog = getDashboardBlogById(blogId);
        if (!blog) {
          showToast("Blog not found.");
          router.replace("/tb-dashboard/blogs");
          return;
        }

        setBlogTitle(blog.title);
        setBlogSlug(blog.slug);
        setBlogExcerpt(blog.excerpt);
        setBlogStatus(blog.status);
        setSeoTitle(blog.seoTitle);
        setSeoDescription(blog.seoDescription);
        setBlogCategory(blog.category);
        setBlogDate(blog.dateLabel);
        setBodyHtml(blog.bodyHtml);
        setSelectedImageUrl(blog.coverImageUrl || null);
        setSlugTouched(true);
      } else {
        resetBlogForm({
          setBlogTitle,
          setBlogSlug,
          setBlogExcerpt,
          setBlogCategory,
          setBlogDate,
          setBlogStatus,
          setSeoTitle,
          setSeoDescription,
          setBodyHtml,
          setSelectedImageUrl,
        });
        setSlugTouched(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [blogId, router, showToast]);

  async function handleUploadImage(file: File) {
    const image = await addDashboardBlogImage(file);
    setImages((prev) => [image, ...prev]);
    showToast("Image uploaded.");
  }

  function handleSaveBlog() {
    if (!blogTitle.trim()) {
      showToast("Blog title is required.");
      return;
    }
    if (!slugIsValid) {
      showToast("Fix the slug format before saving.");
      return;
    }
    if (!selectedImageUrl) {
      showToast("One image is required.");
      return;
    }

    setIsSubmittingBlog(true);
    try {
      const payload = {
        title: blogTitle,
        slug: blogSlug,
        excerpt: blogExcerpt,
        status: blogStatus,
        seoTitle,
        seoDescription,
        category: blogCategory,
        dateLabel: blogDate,
        bodyHtml,
        coverImageUrl: selectedImageUrl,
      };

      // TODO(integrate): replace local storage helpers with real blog APIs.
      if (isEditMode && blogId) {
        const updated = updateDashboardBlog(blogId, payload);
        if (!updated) {
          showToast("Unable to update blog.");
          return;
        }
        showToast("Blog updated.");
      } else {
        createDashboardBlog(payload);
        showToast("Blog created.");
      }

      router.push("/tb-dashboard/blogs");
    } finally {
      setIsSubmittingBlog(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-foreground/55">Loading blog editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
        <button
          type="button"
          onClick={() => router.push("/tb-dashboard/blogs")}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-logo-bg/70 transition-colors hover:text-logo-bg"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </button>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-dark">
          {isEditMode ? "Edit Blog" : "Create New Blog"}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-logo-bg md:text-3xl">
          Blog Editor
        </h1>
        <p className="mt-3 text-sm text-foreground/55 md:text-base">
          Create blogs in the same structure/style currently shown on frontend
          blog pages.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm lg:col-span-8">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={blogTitle}
              onChange={(e) => {
                const nextTitle = e.target.value;
                setBlogTitle(nextTitle);
                if (!slugTouched && !isEditMode) {
                  setBlogSlug(slugifyBlogTitle(nextTitle));
                }
              }}
              placeholder="Blog title"
              className={inputClassName}
            />
            <div>
              <input
                value={blogSlug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setBlogSlug(e.target.value);
                }}
                placeholder="Slug (optional)"
                aria-invalid={!slugIsValid}
                className={`${inputClassName} w-full ${!slugIsValid ? "border-red-300 focus:border-red-400 focus:ring-red-200" : ""}`}
              />
              <p
                className={`mt-1 text-xs ${slugIsValid ? "text-foreground/50" : "text-red-600"}`}
              >
                {slugHint}
              </p>
            </div>
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="SEO title (optional)"
              className={inputClassName}
            />
            <select
              value={blogStatus}
              onChange={(e) => setBlogStatus(e.target.value as BlogStatus)}
              className={inputClassName}
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </select>
            <input
              value={blogCategory}
              onChange={(e) => setBlogCategory(e.target.value)}
              placeholder="Category (e.g. Cargo Expedition)"
              className={inputClassName}
            />
            <input
              value={blogDate}
              onChange={(e) => setBlogDate(e.target.value)}
              placeholder="Date label (e.g. 24 Apr 2026)"
              className={inputClassName}
            />
          </div>

          <textarea
            value={blogExcerpt}
            onChange={(e) => setBlogExcerpt(e.target.value)}
            placeholder="Excerpt for blog cards"
            className={`mt-3 w-full ${inputClassName}`}
            rows={3}
          />
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="SEO description"
            className={`mt-3 w-full ${inputClassName}`}
            rows={2}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              disabled
              title="Preview will open the public /blog page after integration"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold text-foreground/40"
            >
              <ExternalLink size={15} />
              Preview on site
            </button>
            {previewSlug ? (
              <p className="text-xs text-foreground/45">
                Future URL: /blog/{previewSlug}
              </p>
            ) : null}
          </div>

          <div className="mt-4 rounded-xl border border-black/10 p-4">
            <p className="text-sm font-semibold text-logo-bg">
              Blog Body (WYSIWYG)
            </p>
            <div className="mt-3">
              <BlogBodyEditor
                editorKey={blogId ?? "create"}
                value={bodyHtml}
                onChange={setBodyHtml}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm lg:col-span-4">
          <p className="text-sm font-semibold text-logo-bg">Images Bucket</p>
          <p className="mt-1 text-xs text-foreground/55">
            Select one cover image. Uploads are stored as base64 in browser
            localStorage for this UI preview only — they will not sync across
            devices until the backend image API is integrated.
          </p>

          <label className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-primary/50 px-3 py-2 text-sm font-semibold text-logo-bg hover:bg-primary/10">
            <ImagePlus size={15} />
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  await handleUploadImage(file);
                } catch (error) {
                  showToast(
                    error instanceof Error ? error.message : "Upload failed.",
                  );
                }
                e.currentTarget.value = "";
              }}
            />
          </label>

          <div className="mt-3 max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {images.map((image) => {
              const isSelected = selectedImageUrl === image.publicUrl;
              return (
                <div
                  key={image.id}
                  className="rounded-lg border border-black/10 p-2"
                >
                  <div className="relative h-32 w-full overflow-hidden rounded-md">
                    <Image
                      src={image.publicUrl}
                      alt={image.altText ?? "Blog image"}
                      fill
                      unoptimized={image.publicUrl.startsWith("data:")}
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedImageUrl(image.publicUrl)}
                    className={`mt-2 w-full rounded-md px-2 py-1 text-xs font-semibold ${
                      isSelected
                        ? "bg-logo-bg text-white"
                        : "border border-black/15 text-logo-bg"
                    }`}
                  >
                    {isSelected ? "Selected Cover" : "Use as Cover"}
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleSaveBlog}
            disabled={isSubmittingBlog}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-logo-bg px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            <Save size={16} />
            {isSubmittingBlog
              ? "Saving Blog..."
              : isEditMode
                ? "Update Blog"
                : "Save Blog"}
          </button>
        </div>
      </div>
    </div>
  );
}
