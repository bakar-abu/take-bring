import { BlogListPage, BlogSeo } from "@/components/blog";
import { BLOG_PAGE } from "@/config/blog";
import { generatePageMetadata } from "@/lib/seo/page-helpers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale, {
    metadataKey: BLOG_PAGE.metadataKey,
    path: BLOG_PAGE.path,
    keywords: BLOG_PAGE.keywords,
  });
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <BlogSeo locale={locale} />
      <BlogListPage />
    </>
  );
}
