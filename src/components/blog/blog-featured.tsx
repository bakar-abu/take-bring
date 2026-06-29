"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { BLOG_POSTS, formatBlogDate } from "@/config/blog";
import { SectionTag } from "./blog-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

export function BlogFeatured() {
  const t = useTranslations("blogPage");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const post = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const Icon = post.icon;

  return (
    <section className="bg-white pt-16 md:pt-24" aria-labelledby="blog-featured-heading">
      <div className="container-content px-4 md:px-8">
        <div className="mb-8">
          <SectionTag>{t("featuredTag")}</SectionTag>
          <h2
            id="blog-featured-heading"
            className="text-2xl font-extrabold tracking-tight text-logo-bg md:text-3xl"
          >
            {t("featuredTitle")}
          </h2>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <Link
            href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
            className="group grid overflow-hidden rounded-3xl border border-logo-bg/10 bg-white shadow-[0_12px_48px_rgba(52,52,50,0.1)] transition-all duration-500 hover:shadow-[0_28px_64px_rgba(52,52,50,0.16)] lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[360px]">
              <Image
                src={post.image}
                alt={t(`posts.${post.slug}.title`)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <span
                className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-logo-bg shadow-lg"
                style={{ background: post.accent }}
              >
                <Icon className="h-4 w-4" strokeWidth={2.2} />
                {t(`posts.${post.slug}.category`)}
              </span>
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <div className="mb-4 flex items-center gap-3 text-xs font-semibold text-foreground/55">
                <span>{formatBlogDate(post.date, locale)}</span>
                <span className="h-1 w-1 rounded-full bg-foreground/30" />
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime} {t("readTime")}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold leading-tight text-logo-bg transition-colors group-hover:text-primary-dark md:text-3xl">
                {t(`posts.${post.slug}.title`)}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-foreground/65">
                {t(`posts.${post.slug}.excerpt`)}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary-dark">
                {t("readMore")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
              </span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
