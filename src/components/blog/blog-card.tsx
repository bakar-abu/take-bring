"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { formatBlogDate, type BlogPost } from "@/config/blog";

const EASE = [0.22, 1, 0.36, 1] as const;

export function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const t = useTranslations("blogPage");
  const locale = useLocale();
  const Icon = post.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: EASE }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-logo-bg/10 bg-white shadow-[0_8px_40px_rgba(52,52,50,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(52,52,50,0.14)]"
    >
      <Link
        href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
        className="flex h-full flex-col"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={post.image}
            alt={t(`posts.${post.slug}.title`)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-logo-bg/60 via-transparent to-transparent" />
          <span
            className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-logo-bg shadow-lg"
            style={{ background: post.accent }}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
            {t(`posts.${post.slug}.category`)}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-center gap-3 text-xs font-semibold text-foreground/55">
            <span>{formatBlogDate(post.date, locale)}</span>
            <span className="h-1 w-1 rounded-full bg-foreground/30" />
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime} {t("readTime")}
            </span>
          </div>
          <h3 className="text-lg font-extrabold leading-snug text-logo-bg transition-colors group-hover:text-primary-dark">
            {t(`posts.${post.slug}.title`)}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/65">
            {t(`posts.${post.slug}.excerpt`)}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-dark">
            {t("readMore")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
