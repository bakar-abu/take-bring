"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

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
      className="relative overflow-hidden bg-logo-bg py-20 md:py-28"
      aria-labelledby="blog-hero-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #abc629 0, #abc629 1px, transparent 0, transparent 50%)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(171,198,41,0.14),transparent_60%)]" />

      <div className="container-content relative px-4 md:px-8">
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
