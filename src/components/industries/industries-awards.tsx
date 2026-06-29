"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Globe, Shield, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { AWARDS } from "@/config/industries-page";
import { SectionTag } from "./industries-hero";

const EASE = [0.22, 1, 0.36, 1] as const;
const AWARD_ICONS = [Star, Shield, Award, Globe] as const;

function AwardCard({ awardKey, index }: { awardKey: string; index: number }) {
  const t = useTranslations("industriesPage");
  const Icon = AWARD_ICONS[index];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
      className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-white/10"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary transition-colors group-hover:bg-primary group-hover:text-logo-bg">
        <Icon className="h-7 w-7" strokeWidth={1.8} />
      </span>
      <h3 className="mt-4 text-base font-extrabold text-white">
        {t(`${awardKey}Title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/65">
        {t(`${awardKey}Desc`)}
      </p>
    </motion.div>
  );
}

export function IndustriesAwards() {
  const t = useTranslations("industriesPage");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative overflow-hidden bg-logo-bg py-16 md:py-24"
      aria-labelledby="industries-awards-heading"
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
            <span className="text-primary-light">{t("awardsTag")}</span>
          </SectionTag>
          <h2
            id="industries-awards-heading"
            className="text-3xl font-extrabold tracking-tight text-white md:text-4xl"
          >
            {t("awardsTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            {t("awardsSubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AWARDS.map((key, index) => (
            <AwardCard key={key} awardKey={key} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
