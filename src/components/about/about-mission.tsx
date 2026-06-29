"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Compass, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionTag } from "./about-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

const CARDS = [
  { key: "mission", icon: Rocket },
  { key: "vision", icon: Compass },
] as const;

export function AboutMission() {
  const t = useTranslations("aboutPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="relative overflow-hidden bg-[#f4f7f6] py-16 md:py-24"
      aria-labelledby="about-mission-heading"
    >
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="container-content relative px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <SectionTag>{t("missionTag")}</SectionTag>
          <h2
            id="about-mission-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("missionHeading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("missionSubheading")}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.key}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.12, ease: EASE }}
                className="relative overflow-hidden rounded-3xl border border-logo-bg/10 bg-white p-8 shadow-[0_12px_48px_rgba(52,52,50,0.08)] md:p-10"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Icon className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-logo-bg">
                  {t(`${card.key}Title`)}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-foreground/70">
                  {t(`${card.key}Text`)}
                </p>
                <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-primary/5" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
