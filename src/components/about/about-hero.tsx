"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { ABOUT_PAGE } from "@/config/about-page";

const EASE = [0.22, 1, 0.36, 1] as const;

function scrollToForm() {
  document.getElementById("about-lead-form")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
      <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
      <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
      {children}
    </p>
  );
}

export function AboutHero() {
  const t = useTranslations("aboutPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="relative min-h-[56vh] overflow-hidden md:min-h-[64vh]"
      aria-labelledby="about-hero-title"
    >
      <Image
        src={ABOUT_PAGE.heroImage}
        alt={t("heroTitle")}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-logo-bg/92 via-logo-bg/78 to-logo-bg/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(171,198,41,0.18),transparent_55%)]" />

      <div className="container-content relative z-10 flex min-h-[56vh] items-center px-4 py-20 md:min-h-[64vh] md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-light">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("heroTag")}
          </p>
          <h1
            id="about-hero-title"
            className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {t("heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={scrollToForm}
              className="cta-delivery-btn inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold shadow-lg"
            >
              <i className="ri-team-line text-lg" aria-hidden />
              {t("heroCtaPrimary")}
            </button>
            <a
              href="#about-story"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary-light"
            >
              {t("heroCtaSecondary")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
