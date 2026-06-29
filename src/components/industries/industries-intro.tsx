"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionTag } from "./industries-hero";

const EASE = [0.22, 1, 0.36, 1] as const;
const HIGHLIGHTS = [
  "introHighlight1",
  "introHighlight2",
  "introHighlight3",
  "introHighlight4",
] as const;

export function IndustriesIntro() {
  const t = useTranslations("industriesPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="industries-intro-heading">
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto max-w-4xl"
        >
          <div className="text-center">
            <SectionTag>{t("introTag")}</SectionTag>
            <h2
              id="industries-intro-heading"
              className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
            >
              {t("introTitle")}
            </h2>
          </div>
          <p className="mt-6 text-base leading-relaxed text-foreground/70 md:text-lg">
            {t("introP1")}
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/70">
            {t("introP2")}
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {HIGHLIGHTS.map((key) => (
              <li key={key} className="flex items-start gap-3 rounded-xl border border-logo-bg/8 bg-[#f8f9f5] px-4 py-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-logo-bg md:text-base">
                  {t(key)}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
