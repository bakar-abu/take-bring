"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { getRelatedPosts } from "@/config/blog";
import { BlogCard } from "./blog-card";
import { SectionTag } from "./blog-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

export function BlogRelated({ slug }: { slug: string }) {
  const t = useTranslations("blogPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const related = getRelatedPosts(slug, 3);

  if (related.length === 0) return null;

  return (
    <section
      className="bg-[#f4f7f6] py-16 md:py-24"
      aria-labelledby="blog-related-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-10 text-center"
        >
          <SectionTag>{t("relatedTag")}</SectionTag>
          <h2
            id="blog-related-heading"
            className="text-2xl font-extrabold tracking-tight text-logo-bg md:text-3xl"
          >
            {t("relatedTitle")}
          </h2>
        </motion.div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
