"use client";

import { BlogArticle } from "./blog-article";
import { BlogCta } from "./blog-cta";
import { BlogRelated } from "./blog-related";

export function BlogDetailPage({ slug }: { slug: string }) {
  return (
    <>
      <BlogArticle slug={slug} />
      <BlogRelated slug={slug} />
      <BlogCta />
    </>
  );
}
