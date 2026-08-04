import { JsonLd } from "@/components/shared/json-ld";
import { BLOG_PAGE } from "@/config/blog";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/metadata";
import { buildLocalizedUrl } from "@/lib/seo-helpers";
import type { PublicBlogPost } from "@/lib/public-blogs";
import { getTranslations } from "next-intl/server";

export async function BlogSeo({
  locale,
  posts,
}: {
  locale: string;
  posts: PublicBlogPost[];
}) {
  const tMeta = await getTranslations({ locale, namespace: "metadata.blog" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const pageUrl = buildLocalizedUrl(locale, BLOG_PAGE.path);
  const homeUrl = buildLocalizedUrl(locale, "/");

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: tMeta("title"),
    description: tMeta("description"),
    url: pageUrl,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.dateIso,
      url: `${pageUrl}/${post.slug}`,
      author: { "@type": "Organization", name: "Take & Bring" },
    })),
  };

  return (
    <JsonLd
      data={[
        buildWebPageJsonLd({
          title: tMeta("title"),
          description: tMeta("description"),
          url: pageUrl,
        }),
        blogJsonLd,
        buildBreadcrumbJsonLd([
          { name: tNav("home"), url: homeUrl },
          { name: tNav("blogs"), url: pageUrl },
        ]),
      ]}
    />
  );
}
