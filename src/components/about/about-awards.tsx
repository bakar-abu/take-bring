"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { ABOUT_AWARDS, ABOUT_AWARD_ICONS } from "@/config/about-page";
import { SectionTag } from "./about-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

function AwardCard({ awardKey, index }: { awardKey: string; index: number }) {
  const t = useTranslations("aboutPage");
  const Icon = ABOUT_AWARD_ICONS[index];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
      className="group rounded-2xl border border-logo-bg/10 bg-white p-6 text-center shadow-[0_8px_40px_rgba(52,52,50,0.06)] transition-all hover:border-primary/40 hover:shadow-[0_18px_48px_rgba(52,52,50,0.12)]"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-logo-bg">
        <Icon className="h-7 w-7" strokeWidth={1.8} />
      </span>
      <h3 className="mt-4 text-base font-extrabold text-logo-bg">
        {t(`${awardKey}Title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/65">
        {t(`${awardKey}Desc`)}
      </p>
    </motion.div>
  );
}

export function AboutAwards() {
  const t = useTranslations("aboutPage");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-[#f4f7f6] py-16 md:py-24"
      aria-labelledby="about-awards-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <SectionTag>{t("awardsTag")}</SectionTag>
          <h2
            id="about-awards-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("awardsTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("awardsSubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_AWARDS.map((key, index) => (
            <AwardCard key={key} awardKey={key} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
