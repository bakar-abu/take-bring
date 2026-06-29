"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ServiceConfig } from "@/config/services";

const EASE = [0.22, 1, 0.36, 1] as const;
const HIGHLIGHTS = ["highlight1", "highlight2", "highlight3", "highlight4"] as const;
const STATS = ["stat1", "stat2", "stat3"] as const;

export function ServiceIntro({ serviceId }: { serviceId: ServiceConfig["id"] }) {
  const t = useTranslations(`servicesPages.${serviceId}`);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="service-intro-heading">
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              {t("introTag")}
            </p>
            <h2
              id="service-intro-heading"
              className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
            >
              {t("introTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/65 md:text-lg">
              {t("introP1")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/65">
              {t("introP2")}
            </p>
            <ul className="mt-6 space-y-3">
              {HIGHLIGHTS.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-logo-bg md:text-base">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-4">
            {STATS.map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.1, ease: EASE }}
                className="rounded-2xl border border-logo-bg/10 bg-[#f8f9f5] px-6 py-5 shadow-sm"
              >
                <p className="text-2xl font-extrabold text-primary md:text-3xl">
                  {t(`${key}Value`)}
                </p>
                <p className="mt-1 text-sm font-semibold text-logo-bg">
                  {t(`${key}Label`)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
