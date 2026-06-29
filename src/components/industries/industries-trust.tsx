"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { TRUST_ITEMS } from "@/config/industries-page";
import { SectionTag } from "./industries-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

export function IndustriesTrust() {
  const t = useTranslations("industriesPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-[#f4f7f6] py-16 md:py-24"
      aria-labelledby="industries-trust-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto max-w-4xl text-center"
        >
          <SectionTag>{t("trustTag")}</SectionTag>
          <h2
            id="industries-trust-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("trustTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("trustSubtitle")}
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {TRUST_ITEMS.map((key, index) => (
              <motion.li
                key={key}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08, ease: EASE }}
                className="flex items-center gap-3 rounded-2xl border border-logo-bg/10 bg-white px-5 py-4 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <span className="text-left text-sm font-semibold text-logo-bg md:text-base">
                  {t(key)}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
