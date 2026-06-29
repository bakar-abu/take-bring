import { JsonLd } from "@/components/shared/json-ld";
import { BLOG_POSTS, BLOG_PAGE } from "@/config/blog";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/metadata";
import { buildLocalizedUrl } from "@/lib/seo-helpers";
import { getTranslations } from "next-intl/server";

export async function BlogSeo({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "blogPage" });
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
    blogPost: BLOG_POSTS.map((post) => ({
      "@type": "BlogPosting",
      headline: t(`posts.${post.slug}.title`),
      description: t(`posts.${post.slug}.excerpt`),
      datePublished: post.date,
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
