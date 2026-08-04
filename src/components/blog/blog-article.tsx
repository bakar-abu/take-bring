"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Eye, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { formatBlogDate } from "@/config/blog";
import type { PublicBlogPost } from "@/lib/public-blogs";

const EASE = [0.22, 1, 0.36, 1] as const;

function displayDate(post: PublicBlogPost, locale: string) {
  if (post.dateLabel?.trim()) return post.dateLabel.trim();
  return formatBlogDate(post.dateIso.slice(0, 10), locale);
}

export function BlogArticle({ post }: { post: PublicBlogPost }) {
  const t = useTranslations("blogPage");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <article>
      <header className="relative min-h-[56vh] overflow-hidden md:min-h-[64vh]">
        <Image
          src={post.coverImageUrl}
          alt={post.title}
          fill
          unoptimized
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-logo-bg/95 via-logo-bg/82 to-logo-bg/55" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at top right, ${post.accent}55, transparent 55%)`,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #abc629 0, #abc629 1px, transparent 0, transparent 50%)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden
        />

        <div className="container-content relative z-10 flex min-h-[56vh] items-end px-4 pb-14 pt-28 md:min-h-[64vh] md:px-8 md:pb-20 md:pt-32">
          <div className="max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-primary-light"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToBlog")}
            </Link>
            <div className="mt-6">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-logo-bg shadow-lg"
                style={{ background: post.accent }}
              >
                <FileText className="h-4 w-4" strokeWidth={2.2} />
                {post.category}
              </span>
              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm font-medium text-white/75">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {displayDate(post, locale)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {post.readTime} {t("readTime")}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  {(post.viewsCount ?? 0).toLocaleString()} views
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white">
        <div className="container-content px-4 md:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="mx-auto max-w-3xl pt-12 pb-16 md:pt-16 md:pb-24"
          >
            {post.excerpt ? (
              <p className="text-lg font-medium leading-relaxed text-logo-bg md:text-xl">
                {post.excerpt}
              </p>
            ) : null}

            <div
              className="blog-prose mt-8 text-base leading-relaxed text-foreground/80 [&_a]:font-semibold [&_a]:text-primary-dark [&_a]:underline [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-logo-bg [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-logo-bg [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-logo-bg [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />
          </motion.div>
        </div>
      </div>
    </article>
  );
}
