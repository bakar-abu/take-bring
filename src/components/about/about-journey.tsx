"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { ABOUT_MILESTONES } from "@/config/about-page";
import { SectionTag } from "./about-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

function Milestone({
  milestoneKey,
  index,
  isLast,
}: {
  milestoneKey: string;
  index: number;
  isLast: boolean;
}) {
  const t = useTranslations("aboutPage");
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className="relative flex gap-5 sm:gap-8"
    >
      <div className="flex flex-col items-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-logo-bg text-sm font-extrabold text-primary shadow-lg">
          {t(`${milestoneKey}Year`)}
        </span>
        {!isLast ? (
          <div className="mt-3 min-h-[2rem] w-px flex-1 bg-primary/30" />
        ) : null}
      </div>
      <article className="mb-8 flex-1 rounded-2xl border border-logo-bg/8 bg-white p-5 shadow-sm sm:mb-10 sm:p-7">
        <h3 className="text-lg font-extrabold text-logo-bg sm:text-xl">
          {t(`${milestoneKey}Title`)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/65 sm:text-base">
          {t(`${milestoneKey}Desc`)}
        </p>
      </article>
    </motion.li>
  );
}

export function AboutJourney() {
  const t = useTranslations("aboutPage");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-[#f4f7f6] py-16 md:py-24"
      aria-labelledby="about-journey-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <SectionTag>{t("journeyTag")}</SectionTag>
          <h2
            id="about-journey-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("journeyTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("journeySubtitle")}
          </p>
        </motion.div>

        <ol className="mx-auto max-w-3xl list-none">
          {ABOUT_MILESTONES.map((key, index) => (
            <Milestone
              key={key}
              milestoneKey={key}
              index={index}
              isLast={index === ABOUT_MILESTONES.length - 1}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
