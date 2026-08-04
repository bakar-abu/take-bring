"use client";

import { BlogArticle } from "./blog-article";
import { BlogCta } from "./blog-cta";
import { BlogRelated } from "./blog-related";
import type { PublicBlogPost } from "@/lib/public-blogs";

export function BlogDetailPage({
  post,
  related,
}: {
  post: PublicBlogPost;
  related: PublicBlogPost[];
}) {
  return (
    <>
      <BlogArticle post={post} />
      <BlogRelated posts={related} />
      <BlogCta />
    </>
  );
}
