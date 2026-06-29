"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { ABOUT_METRICS } from "@/config/about-page";
import { SectionTag } from "./about-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

function MetricCard({ metricKey, index }: { metricKey: string; index: number }) {
  const t = useTranslations("aboutPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
    >
      <span className="font-mono text-4xl font-extrabold text-primary md:text-5xl">
        {t(`${metricKey}Value`)}
      </span>
      <h3 className="mt-3 text-lg font-extrabold text-white">
        {t(`${metricKey}Label`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/65">
        {t(`${metricKey}Desc`)}
      </p>
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/10" />
    </motion.div>
  );
}

export function AboutMetrics() {
  const t = useTranslations("aboutPage");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative overflow-hidden bg-logo-bg py-16 md:py-24"
      aria-labelledby="about-metrics-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(171,198,41,0.08),transparent_70%)]" />
      <div className="container-content relative px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <SectionTag>
            <span className="text-primary-light">{t("impactTag")}</span>
          </SectionTag>
          <h2
            id="about-metrics-heading"
            className="text-3xl font-extrabold tracking-tight text-white md:text-4xl"
          >
            {t("impactTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            {t("impactSubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {ABOUT_METRICS.map((key, index) => (
            <MetricCard key={key} metricKey={key} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
