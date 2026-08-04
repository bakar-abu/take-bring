"use client";

import { BlogCta } from "./blog-cta";
import { BlogFeatured } from "./blog-featured";
import { BlogGrid } from "./blog-grid";
import { BlogHero } from "./blog-hero";
import type { PublicBlogPost } from "@/lib/public-blogs";

export function BlogListPage({ posts }: { posts: PublicBlogPost[] }) {
  const featured = posts[0] ?? null;
  const gridPosts = posts.slice(1);

  return (
    <>
      <BlogHero />
      <BlogFeatured post={featured} />
      <BlogGrid posts={gridPosts} />
      <BlogCta />
    </>
  );
}
