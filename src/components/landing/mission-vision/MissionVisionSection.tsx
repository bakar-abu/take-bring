"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { useTranslations } from "next-intl";

/* ✅ FIX: tuple-based easing */
const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE_OUT, // ✅ FIXED
    },
  },
};

export function MissionVisionSection() {
  const t = useTranslations("missionVisionSection");

  return (
    <section
      className="bg-[#f4f7f6] px-4 py-16 sm:px-6 md:px-8"
      aria-labelledby="mission-vision-heading"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.5,
            ease: EASE_OUT, // ✅ FIXED
          }}
        >
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-dark/70">
            <span className="h-2 w-2 rotate-45 bg-accent" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-accent" aria-hidden />
            {t("tag")}
          </p>

          <h2
            id="mission-vision-heading"
            className="text-2xl font-bold text-primary-dark sm:text-3xl"
          >
            {t("title")}
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div
            variants={itemVariants}
            className="section-card-hover rounded-xl border border-primary-light/15 bg-white p-8 shadow-sm"
          >
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="h-7 w-7" strokeWidth={1.7} aria-hidden />
            </span>
            <h3 className="text-xl font-bold text-primary-dark">
              {t("missionTitle")}
            </h3>
            <p className="mt-4 leading-relaxed text-primary-dark/80">
              {t("missionText")}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="section-card-hover rounded-xl border border-primary-light/15 bg-white p-8 shadow-sm"
          >
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Eye className="h-7 w-7" strokeWidth={1.7} aria-hidden />
            </span>
            <h3 className="text-xl font-bold text-primary-dark">
              {t("visionTitle")}
            </h3>
            <p className="mt-4 leading-relaxed text-primary-dark/80">
              {t("visionText")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
