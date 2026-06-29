"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { METRICS } from "@/config/industries-page";
import { SectionTag } from "./industries-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

function MetricCard({ metricKey, index }: { metricKey: string; index: number }) {
  const t = useTranslations("industriesPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
      className="relative overflow-hidden rounded-3xl border border-logo-bg/10 bg-white p-8 shadow-[0_12px_48px_rgba(52,52,50,0.08)]"
    >
      <span className="font-mono text-4xl font-extrabold text-primary md:text-5xl">
        {t(`${metricKey}Value`)}
      </span>
      <h3 className="mt-3 text-lg font-extrabold text-logo-bg">
        {t(`${metricKey}Label`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/65">
        {t(`${metricKey}Desc`)}
      </p>
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/5" />
    </motion.div>
  );
}

export function IndustriesMetrics() {
  const t = useTranslations("industriesPage");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative overflow-hidden bg-[#f4f7f6] py-16 md:py-24"
      aria-labelledby="industries-metrics-heading"
    >
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="container-content relative px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <SectionTag>{t("metricsTag")}</SectionTag>
          <h2
            id="industries-metrics-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("metricsTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("metricsSubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {METRICS.map((key, index) => (
            <MetricCard key={key} metricKey={key} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
