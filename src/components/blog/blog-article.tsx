"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Calendar, Check, Clock, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { formatBlogDate, getBlogPost } from "@/config/blog";

const EASE = [0.22, 1, 0.36, 1] as const;

type ArticleSection = {
  heading: string;
  body: string[];
};

export function BlogArticle({ slug }: { slug: string }) {
  const t = useTranslations("blogPage");
  const locale = useLocale();
  const post = getBlogPost(slug);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  if (!post) return null;

  const Icon = post.icon;
  const base = `posts.${slug}`;
  const sections = t.raw(`${base}.sections`) as ArticleSection[];
  const takeaways = t.raw(`${base}.takeaways`) as string[];

  return (
    <article>
      <header className="relative overflow-hidden bg-logo-bg pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(171,198,41,0.14),transparent_60%)]" />
        <div className="container-content relative px-4 md:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-primary-light"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToBlog")}
          </Link>
          <div className="mt-6 max-w-3xl">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-logo-bg shadow-lg"
              style={{ background: post.accent }}
            >
              <Icon className="h-4 w-4" strokeWidth={2.2} />
              {t(`${base}.category`)}
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
              {t(`${base}.title`)}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm font-medium text-white/70">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                {t(`${base}.author`)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {formatBlogDate(post.date, locale)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                {post.readTime} {t("readTime")}
              </span>
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
            className="relative -mt-8 mb-12 overflow-hidden rounded-3xl shadow-2xl md:-mt-12"
          >
            <div className="relative aspect-[16/9]">
              <Image
                src={post.image}
                alt={t(`${base}.title`)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1100px"
                priority
              />
            </div>
          </motion.div>

          <div className="mx-auto max-w-3xl pb-16 md:pb-24">
            <p className="text-lg font-medium leading-relaxed text-logo-bg md:text-xl">
              {t(`${base}.intro`)}
            </p>

            {sections.map((section, index) => (
              <section key={index} className="mt-10">
                <h2 className="text-2xl font-extrabold tracking-tight text-logo-bg md:text-[1.75rem]">
                  {section.heading}
                </h2>
                {section.body.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="mt-4 text-base leading-relaxed text-foreground/75"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <div className="mt-12 rounded-3xl border border-logo-bg/10 bg-[#f8f9f5] p-7 md:p-8">
              <h2 className="text-xl font-extrabold text-logo-bg">
                {t("takeawaysTitle")}
              </h2>
              <ul className="mt-5 space-y-3">
                {takeaways.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium leading-relaxed text-logo-bg md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
