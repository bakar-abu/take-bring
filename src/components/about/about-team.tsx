"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { ABOUT_PAGE, ABOUT_TEAM } from "@/config/about-page";
import { SectionTag } from "./about-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutTeam() {
  const t = useTranslations("aboutPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-white py-16 md:py-24"
      aria-labelledby="about-team-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <SectionTag>{t("teamTag")}</SectionTag>
          <h2
            id="about-team-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("teamTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("teamSubtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mb-12 min-h-[260px] overflow-hidden rounded-3xl shadow-2xl md:min-h-[420px]"
        >
          <Image
            src={ABOUT_PAGE.teamImage}
            alt={t("teamTitle")}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-logo-bg/70 via-logo-bg/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <p className="max-w-2xl text-base font-semibold text-white md:text-lg">
              {t("teamCaption")}
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_TEAM.map((key, index) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
              className="rounded-3xl border border-logo-bg/10 bg-[#f8f9f5] p-6 text-center"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-logo-bg text-xl font-extrabold text-primary">
                {t(`${key}Initials`)}
              </span>
              <h3 className="mt-4 text-base font-extrabold text-logo-bg">
                {t(`${key}Name`)}
              </h3>
              <p className="text-sm font-semibold text-primary">
                {t(`${key}Role`)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                {t(`${key}Bio`)}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
