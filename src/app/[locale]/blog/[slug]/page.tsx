import { BlogDetailPage, BlogPostSeo } from "@/components/blog";
import { BLOG_POSTS, getBlogPost } from "@/config/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/types/locale";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const t = await getTranslations({ locale, namespace: "blogPage" });
  const base = `posts.${slug}`;

  return buildMetadata({
    locale: locale as Locale,
    title: t(`${base}.metaTitle`),
    description: t(`${base}.metaDescription`),
    path: `/blog/${slug}`,
    keywords: [t(`${base}.category`), "logistics", "Take & Bring"],
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <BlogPostSeo locale={locale} slug={slug} />
      <BlogDetailPage slug={slug} />
    </>
  );
}
