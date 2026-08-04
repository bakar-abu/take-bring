import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  mapBlogRow,
  type BlogRow,
} from "@/lib/dashboard-blogs/map";
import type { DashboardBlog } from "@/lib/dashboard-blogs/types";

const BLOG_SELECT =
  "id, title, slug, excerpt, status, seo_title, seo_description, category, date_label, body_html, cover_image_url, cover_image_asset_id, views_count, published_at, created_at, updated_at" as const;

const ACCENTS = [
  "#abc629",
  "#3498db",
  "#e67e22",
  "#9b59b6",
  "#2ecc71",
  "#f4d03f",
];

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  dateLabel: string;
  /** ISO date for formatting / sitemap */
  dateIso: string;
  bodyHtml: string;
  coverImageUrl: string;
  viewsCount: number;
  readTime: number;
  accent: string;
  featured?: boolean;
};

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function accentForSlug(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash + slug.charCodeAt(i) * (i + 1)) % ACCENTS.length;
  }
  return ACCENTS[hash] ?? ACCENTS[0];
}

function toPublicPost(blog: DashboardBlog, featured = false): PublicBlogPost {
  const dateIso =
    blog.publishedAt || blog.createdAt || new Date().toISOString();
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    seoTitle: blog.seoTitle || blog.title,
    seoDescription: blog.seoDescription || blog.excerpt,
    category: blog.category || "Logistics",
    dateLabel: blog.dateLabel,
    dateIso,
    bodyHtml: blog.bodyHtml,
    coverImageUrl: blog.coverImageUrl || "/images/blog-hero.webp",
    viewsCount: blog.viewsCount ?? 0,
    readTime: estimateReadTime(blog.bodyHtml),
    accent: accentForSlug(blog.slug),
    featured,
  };
}

export async function getPublishedBlogs(): Promise<PublicBlogPost[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_SELECT)
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const blogs = (data ?? []).map((row) => mapBlogRow(row as BlogRow));
  return blogs.map((blog, index) => toPublicPost(blog, index === 0));
}

export async function getPublishedBlogBySlug(
  slug: string,
): Promise<PublicBlogPost | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_SELECT)
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return toPublicPost(mapBlogRow(data as BlogRow));
}

export async function getRelatedPublishedBlogs(
  slug: string,
  limit = 3,
): Promise<PublicBlogPost[]> {
  const posts = await getPublishedBlogs();
  return posts.filter((post) => post.slug !== slug).slice(0, limit);
}

/** Atomically increase view count when a public detail page is opened. */
export async function incrementBlogViews(slug: string): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: findError } = await supabase
    .from("blogs")
    .select("id, views_count")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (findError) throw new Error(findError.message);
  if (!existing) return 0;

  const next = (existing.views_count ?? 0) + 1;
  const { error } = await supabase
    .from("blogs")
    .update({ views_count: next })
    .eq("id", existing.id);

  if (error) throw new Error(error.message);
  return next;
}
