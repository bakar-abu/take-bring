import { JsonLd } from "@/components/shared/json-ld";
import { siteConfig } from "@/config/site";
import { BLOG_PAGE } from "@/config/blog";
import { buildBreadcrumbJsonLd, getBrandImageUrl } from "@/lib/seo/metadata";
import { buildLocalizedUrl } from "@/lib/seo-helpers";
import type { PublicBlogPost } from "@/lib/public-blogs";
import { getTranslations } from "next-intl/server";

export async function BlogPostSeo({
  locale,
  post,
}: {
  locale: string;
  post: PublicBlogPost;
}) {
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const blogUrl = buildLocalizedUrl(locale, BLOG_PAGE.path);
  const homeUrl = buildLocalizedUrl(locale, "/");
  const postUrl = `${blogUrl}/${post.slug}`;
  const imageUrl = post.coverImageUrl.startsWith("http")
    ? post.coverImageUrl
    : `${siteConfig.url}${post.coverImageUrl}`;

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.dateIso,
    dateModified: post.dateIso,
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
    articleSection: post.category,
  };

  return (
    <JsonLd
      data={[
        blogPostingJsonLd,
        buildBreadcrumbJsonLd([
          { name: tNav("home"), url: homeUrl },
          { name: tNav("blogs"), url: blogUrl },
          { name: post.title, url: postUrl },
        ]),
      ]}
    />
  );
}
