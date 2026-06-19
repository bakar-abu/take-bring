"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Globe, Package } from "lucide-react";
import { useTranslations } from "next-intl";

const COMPETENCIES = [
  "competencyCourier",
  "competencyFreight",
  "competencyRefrigerated",
  "competencyCustom",
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutSection() {
  const t = useTranslations("aboutSection");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="overflow-hidden py-20 md:py-28"
      aria-labelledby="about-heading"
    >
      <div className="container-content grid items-stretch gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, x: -32 }}
          animate={headerInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative min-h-[320px] md:min-h-[480px]"
        >
          <div className="relative h-full min-h-[320px] overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(52,52,50,0.12)] md:min-h-[480px]">
            <Image
              src="/images/about-section-img-2.webp"
              alt={t("imageAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-primary/20"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={headerInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.15, ease: EASE }}
              className="absolute bottom-6 left-6 rounded-2xl border border-white/30 bg-primary px-6 py-5 text-white shadow-lg"
            >
              <span className="block text-4xl font-extrabold leading-none">
                {t("experienceYears")}
              </span>
              <span className="mt-1 block text-sm font-medium opacity-95">
                {t("experienceLabel")} {t("experienceSubLabel")}
              </span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("tag")}
          </p>
          <h2
            id="about-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("title")}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("paragraph1")}
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/65">
            {t("paragraph2")}
          </p>

          <ul
            className="mt-6 grid gap-3"
            aria-label={t("competenciesAriaLabel")}
          >
            {COMPETENCIES.map((key) => (
              <li key={key} className="flex items-start gap-3">
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                <span className="text-sm leading-relaxed text-foreground/65 md:text-base">
                  <strong className="text-logo-bg">{t(`${key}Title`)}</strong>
                  {": "}
                  {t(`${key}Text`)}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-base leading-relaxed text-foreground/65">
            {t("paragraph3")}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Globe, title: t("missionsTitle"), text: t("missionsText") },
              { icon: Package, title: t("visionTitle"), text: t("visionText") },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-logo-bg/8 bg-logo-bg/5 p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md"
              >
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                </span>
                <h3 className="text-base font-bold text-logo-bg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
