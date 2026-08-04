import { BlogDetailPage, BlogPostSeo } from "@/components/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/types/locale";
import {
  getPublishedBlogBySlug,
  getPublishedBlogs,
  getRelatedPublishedBlogs,
  incrementBlogViews,
} from "@/lib/public-blogs";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const posts = await getPublishedBlogs();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    locale: locale as Locale,
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${slug}`,
    keywords: [post.category, "logistics", "Take & Bring"].filter(Boolean),
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPublishedBlogBySlug(slug);
  if (!post) notFound();

  // Count a view when the public detail page is opened.
  let viewsCount = post.viewsCount;
  try {
    viewsCount = await incrementBlogViews(slug);
  } catch {
    // Keep existing count if increment fails
  }

  const related = await getRelatedPublishedBlogs(slug, 3);

  return (
    <>
      <BlogPostSeo locale={locale} post={{ ...post, viewsCount }} />
      <BlogDetailPage post={{ ...post, viewsCount }} related={related} />
    </>
  );
}
