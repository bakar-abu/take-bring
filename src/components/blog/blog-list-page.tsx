"use client";

import { BlogCta } from "./blog-cta";
import { BlogFeatured } from "./blog-featured";
import { BlogGrid } from "./blog-grid";
import { BlogHero } from "./blog-hero";

export function BlogListPage() {
  return (
    <>
      <BlogHero />
      <BlogFeatured />
      <BlogGrid />
      <BlogCta />
    </>
  );
}
