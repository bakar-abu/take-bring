"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { ABOUT_VALUES, ABOUT_VALUE_ICONS } from "@/config/about-page";
import { SectionTag } from "./about-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

function ValueCard({ valueKey, index }: { valueKey: string; index: number }) {
  const t = useTranslations("aboutPage");
  const Icon = ABOUT_VALUE_ICONS[index];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 3) * 0.1, ease: EASE }}
      className="group rounded-3xl border border-logo-bg/10 bg-white p-7 shadow-[0_8px_40px_rgba(52,52,50,0.06)] transition-all hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_20px_52px_rgba(52,52,50,0.12)]"
    >
      <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/15 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-logo-bg">
        <Icon className="h-6 w-6" strokeWidth={1.9} />
      </span>
      <h3 className="mt-5 text-lg font-extrabold text-logo-bg">
        {t(`${valueKey}Title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/65">
        {t(`${valueKey}Desc`)}
      </p>
    </motion.div>
  );
}

export function AboutValues() {
  const t = useTranslations("aboutPage");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-white py-16 md:py-24"
      aria-labelledby="about-values-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <SectionTag>{t("valuesTag")}</SectionTag>
          <h2
            id="about-values-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("valuesTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("valuesSubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_VALUES.map((key, index) => (
            <ValueCard key={key} valueKey={key} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
