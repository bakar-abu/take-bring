"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { ABOUT_DIFFERENTIATORS, ABOUT_TRUST } from "@/config/about-page";
import { SectionTag } from "./about-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutWhy() {
  const t = useTranslations("aboutPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="relative overflow-hidden bg-logo-bg py-16 md:py-24"
      aria-labelledby="about-why-heading"
    >
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="container-content relative px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <SectionTag>
            <span className="text-primary-light">{t("whyTag")}</span>
          </SectionTag>
          <h2
            id="about-why-heading"
            className="text-3xl font-extrabold tracking-tight text-white md:text-4xl"
          >
            {t("whyTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            {t("whySubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_DIFFERENTIATORS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-white/10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-white">
                  {t(`${item.key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {t(`${item.key}Desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>

        <ul className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
          {ABOUT_TRUST.map((key, index) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.06, ease: EASE }}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-logo-bg">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className="text-sm font-semibold text-white md:text-base">
                {t(key)}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
