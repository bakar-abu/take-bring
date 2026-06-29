"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { STEPS, STEP_ICONS } from "@/config/industries-page";
import { SectionTag } from "./industries-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

function ProcessStep({
  stepKey,
  index,
  isLast,
}: {
  stepKey: string;
  index: number;
  isLast: boolean;
}) {
  const t = useTranslations("industriesPage");
  const Icon = STEP_ICONS[index];
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
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-logo-bg text-white shadow-lg sm:h-16 sm:w-16">
          <Icon className="h-6 w-6" strokeWidth={1.8} />
          <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-logo-bg">
            {index + 1}
          </span>
        </span>
        {!isLast ? (
          <div className="mt-3 min-h-[2rem] w-px flex-1 bg-primary/30" />
        ) : null}
      </div>
      <article className="mb-8 flex-1 rounded-2xl border border-logo-bg/8 bg-[#f8f9f5] p-5 sm:mb-10 sm:p-7">
        <h3 className="text-lg font-extrabold text-logo-bg sm:text-xl">
          {t(`${stepKey}Title`)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/65 sm:text-base">
          {t(`${stepKey}Desc`)}
        </p>
      </article>
    </motion.li>
  );
}

export function IndustriesProcess() {
  const t = useTranslations("industriesPage");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="industries-process-heading">
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <SectionTag>{t("stepsTag")}</SectionTag>
          <h2
            id="industries-process-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("stepsTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("stepsSubtitle")}
          </p>
        </motion.div>

        <ol className="mx-auto max-w-3xl list-none">
          {STEPS.map((key, index) => (
            <ProcessStep key={key} stepKey={key} index={index} isLast={index === STEPS.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}
