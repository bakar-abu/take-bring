"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { BLOG_PAGE } from "@/config/blog";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SectionTag({
  children,
  light,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${
        light ? "text-primary-light" : "text-logo-bg/70"
      }`}
    >
      <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
      <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
      {children}
    </p>
  );
}

export function BlogHero() {
  const t = useTranslations("blogPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="relative min-h-[52vh] overflow-hidden md:min-h-[58vh]"
      aria-labelledby="blog-hero-title"
    >
      <Image
        src={BLOG_PAGE.heroImage}
        alt={t("heroTitle")}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-logo-bg/92 via-logo-bg/78 to-logo-bg/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(171,198,41,0.18),transparent_55%)]" />

      <div className="container-content relative z-10 flex min-h-[52vh] items-center px-4 py-20 md:min-h-[58vh] md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <SectionTag light>{t("heroTag")}</SectionTag>
          <h1
            id="blog-hero-title"
            className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            {t("heroTitle")}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/80 md:text-lg">
            {t("heroSubtitle")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
