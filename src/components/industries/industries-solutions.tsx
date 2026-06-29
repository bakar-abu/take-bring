"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { INDUSTRIES } from "@/config/industries-page";
import { SectionTag } from "./industries-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

export function IndustriesSolutions() {
  const t = useTranslations("industriesPage");
  const [active, setActive] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const current = INDUSTRIES[active];
  const Icon = current.icon;

  return (
    <section
      className="bg-logo-bg py-16 md:py-24"
      aria-labelledby="industries-solutions-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <SectionTag>
            <span className="text-primary-light">{t("solutionsTag")}</span>
          </SectionTag>
          <h2
            id="industries-solutions-heading"
            className="text-3xl font-extrabold tracking-tight text-white md:text-4xl"
          >
            {t("solutionsTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            {t("solutionsSubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col gap-1.5">
            {INDUSTRIES.map((industry, index) => {
              const ItemIcon = industry.icon;
              const isActive = index === active;
              return (
                <button
                  key={industry.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-logo-bg shadow-lg"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <ItemIcon className="h-4 w-4 shrink-0" />
                  {t(`${industry.id}Name`)}
                </button>
              );
            })}
          </div>

          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8"
          >
            <div className="flex items-start gap-4">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg"
                style={{ background: current.accent }}
              >
                <Icon className="h-7 w-7 text-logo-bg" strokeWidth={2} />
              </span>
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  {t(`${current.id}Name`)}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-white/75">
                  {t(`${current.id}Desc`)}
                </p>
              </div>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {(["Service1", "Service2", "Service3"] as const).map((suffix) => (
                <li
                  key={suffix}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                >
                  <ChevronDown className="h-4 w-4 -rotate-90 text-primary" />
                  {t(`${current.id}${suffix}`)}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
