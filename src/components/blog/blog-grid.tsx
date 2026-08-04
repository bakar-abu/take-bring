"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PublicBlogPost } from "@/lib/public-blogs";
import { BlogCard } from "./blog-card";
import { SectionTag } from "./blog-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

export function BlogGrid({ posts }: { posts: PublicBlogPost[] }) {
  const t = useTranslations("blogPage");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="blog-grid-heading">
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-10"
        >
          <SectionTag>{t("allTag")}</SectionTag>
          <h2
            id="blog-grid-heading"
            className="text-2xl font-extrabold tracking-tight text-logo-bg md:text-3xl"
          >
            {t("allTitle")}
          </h2>
        </motion.div>

        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-logo-bg/15 px-6 py-12 text-center text-sm text-foreground/55">
            No published posts yet.
          </p>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
