import { JsonLd } from "@/components/shared/json-ld";
import { siteConfig } from "@/config/site";
import { getBlogPost, BLOG_PAGE } from "@/config/blog";
import { buildBreadcrumbJsonLd, getBrandImageUrl } from "@/lib/seo/metadata";
import { buildLocalizedUrl } from "@/lib/seo-helpers";
import { getTranslations } from "next-intl/server";

export async function BlogPostSeo({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) {
  const post = getBlogPost(slug);
  if (!post) return null;

  const t = await getTranslations({ locale, namespace: "blogPage" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const blogUrl = buildLocalizedUrl(locale, BLOG_PAGE.path);
  const homeUrl = buildLocalizedUrl(locale, "/");
  const postUrl = `${blogUrl}/${slug}`;
  const base = `posts.${slug}`;

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: t(`${base}.title`),
    description: t(`${base}.excerpt`),
    image: `${siteConfig.url}${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      logo: { "@type": "ImageObject", url: getBrandImageUrl() },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    url: postUrl,
    articleSection: t(`${base}.category`),
  };

  return (
    <JsonLd
      data={[
        blogPostingJsonLd,
        buildBreadcrumbJsonLd([
          { name: tNav("home"), url: homeUrl },
          { name: tNav("blogs"), url: blogUrl },
          { name: t(`${base}.title`), url: postUrl },
        ]),
      ]}
    />
  );
}
