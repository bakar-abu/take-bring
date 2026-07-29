"use client";

import {
  MOCK_BLOG_IMAGES,
  MOCK_BLOGS,
} from "@/lib/dashboard-blogs/mock-blogs";
import type {
  BlogEditorInput,
  BlogImageAsset,
  BlogStatus,
  DashboardBlog,
} from "@/lib/dashboard-blogs/types";

const BLOGS_KEY = "tb-dashboard-blogs";
const IMAGES_KEY = "tb-dashboard-blog-images";

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function ensureMockBlogsSeeded() {
  if (!canUseStorage()) return;
  if (!window.localStorage.getItem(BLOGS_KEY)) {
    writeJson(BLOGS_KEY, MOCK_BLOGS);
  }
  if (!window.localStorage.getItem(IMAGES_KEY)) {
    writeJson(IMAGES_KEY, MOCK_BLOG_IMAGES);
  }
}

export function listDashboardBlogs(): DashboardBlog[] {
  ensureMockBlogsSeeded();
  return readJson<DashboardBlog[]>(BLOGS_KEY, MOCK_BLOGS);
}

export function getDashboardBlogById(id: string): DashboardBlog | null {
  return listDashboardBlogs().find((blog) => blog.id === id) ?? null;
}

export function listDashboardBlogImages(): BlogImageAsset[] {
  ensureMockBlogsSeeded();
  return readJson<BlogImageAsset[]>(IMAGES_KEY, MOCK_BLOG_IMAGES);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createDashboardBlog(input: BlogEditorInput): DashboardBlog {
  const now = new Date().toISOString();
  const blog: DashboardBlog = {
    id: `blog-${Date.now()}`,
    title: input.title.trim(),
    slug: input.slug.trim() || slugify(input.title),
    excerpt: input.excerpt.trim(),
    status: input.status,
    seoTitle: input.seoTitle.trim(),
    seoDescription: input.seoDescription.trim(),
    category: input.category.trim(),
    dateLabel: input.dateLabel.trim(),
    bodyHtml: input.bodyHtml,
    coverImageUrl: input.coverImageUrl,
    viewsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const blogs = listDashboardBlogs();
  writeJson(BLOGS_KEY, [blog, ...blogs]);
  return blog;
}

export function updateDashboardBlog(
  id: string,
  input: BlogEditorInput,
): DashboardBlog | null {
  const blogs = listDashboardBlogs();
  const index = blogs.findIndex((blog) => blog.id === id);
  if (index < 0) return null;

  const current = blogs[index];
  const updated: DashboardBlog = {
    ...current,
    title: input.title.trim(),
    slug: input.slug.trim() || slugify(input.title),
    excerpt: input.excerpt.trim(),
    status: input.status,
    seoTitle: input.seoTitle.trim(),
    seoDescription: input.seoDescription.trim(),
    category: input.category.trim(),
    dateLabel: input.dateLabel.trim(),
    bodyHtml: input.bodyHtml,
    coverImageUrl: input.coverImageUrl,
    updatedAt: new Date().toISOString(),
  };

  blogs[index] = updated;
  writeJson(BLOGS_KEY, blogs);
  return updated;
}

export function updateDashboardBlogStatus(id: string, status: BlogStatus) {
  const blogs = listDashboardBlogs();
  const index = blogs.findIndex((blog) => blog.id === id);
  if (index < 0) return null;

  blogs[index] = {
    ...blogs[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  writeJson(BLOGS_KEY, blogs);
  return blogs[index];
}

export function deleteDashboardBlog(id: string) {
  const blogs = listDashboardBlogs().filter((blog) => blog.id !== id);
  writeJson(BLOGS_KEY, blogs);
}

export function addDashboardBlogImage(file: File): Promise<BlogImageAsset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image: BlogImageAsset = {
        id: `img-${Date.now()}`,
        publicUrl: String(reader.result),
        altText: file.name,
        createdAt: new Date().toISOString(),
      };
      const images = listDashboardBlogImages();
      writeJson(IMAGES_KEY, [image, ...images]);
      resolve(image);
    };
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}
