"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { ABOUT_PAGE } from "@/config/about-page";
import { SectionTag } from "./about-hero";

const EASE = [0.22, 1, 0.36, 1] as const;
const STORY_HIGHLIGHTS = [
  "storyHighlight1",
  "storyHighlight2",
  "storyHighlight3",
  "storyHighlight4",
] as const;

export function AboutStory() {
  const t = useTranslations("aboutPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="about-story"
      className="scroll-mt-24 bg-white py-16 md:py-24"
      aria-labelledby="about-story-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="relative">
            <div className="relative min-h-[320px] overflow-hidden rounded-3xl shadow-2xl md:min-h-[440px]">
              <Image
                src={ABOUT_PAGE.storyImage}
                alt={t("storyTitle")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-logo-bg/55 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-2 hidden rounded-2xl bg-primary px-6 py-5 shadow-xl sm:block md:-right-6">
              <p className="text-3xl font-extrabold text-logo-bg">
                {t("storyBadgeValue")}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-logo-bg/80">
                {t("storyBadgeLabel")}
              </p>
            </div>
          </div>

          <div>
            <SectionTag>{t("storyTag")}</SectionTag>
            <h2
              id="about-story-heading"
              className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
            >
              {t("storyTitle")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              {t("storyP1")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/65">
              {t("storyP2")}
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {STORY_HIGHLIGHTS.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-3 rounded-xl border border-logo-bg/8 bg-[#f8f9f5] px-4 py-3"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-logo-bg">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
