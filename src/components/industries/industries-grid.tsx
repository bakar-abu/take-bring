"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { INDUSTRIES } from "@/config/industries-page";
import { SectionTag } from "./industries-hero";
import { IndustryCard } from "./industry-card";

const EASE = [0.22, 1, 0.36, 1] as const;

export function IndustriesGrid() {
  const t = useTranslations("industriesPage");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-[#f4f7f6] py-16 md:py-24"
      aria-labelledby="industries-grid-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <SectionTag>{t("gridTag")}</SectionTag>
          <h2
            id="industries-grid-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("gridTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("gridSubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((industry, index) => (
            <IndustryCard key={industry.id} industry={industry} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
