"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { EXPERTISE, INDUSTRIES_PAGE } from "@/config/industries-page";
import { SectionTag } from "./industries-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

export function IndustriesExpertise() {
  const t = useTranslations("industriesPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="industries-expertise-heading">
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="relative min-h-[300px] overflow-hidden rounded-3xl shadow-2xl md:min-h-[400px]">
            <Image
              src={INDUSTRIES_PAGE.expertiseImage}
              alt={t("expertiseTitle")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-logo-bg/60 to-transparent" />
          </div>

          <div>
            <SectionTag>{t("expertiseTag")}</SectionTag>
            <h2
              id="industries-expertise-heading"
              className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
            >
              {t("expertiseTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/65">
              {t("expertiseSubtitle")}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {EXPERTISE.map((key, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: EASE }}
                  className="rounded-2xl border border-logo-bg/10 bg-[#f8f9f5] p-5 transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <h3 className="text-base font-extrabold text-logo-bg">
                    {t(`${key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                    {t(`${key}Desc`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
