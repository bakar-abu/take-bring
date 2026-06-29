"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { ABOUT_CAPABILITIES } from "@/config/about-page";
import { SectionTag } from "./about-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutCapabilities() {
  const t = useTranslations("aboutPage");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-white py-16 md:py-24"
      aria-labelledby="about-capabilities-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <SectionTag>{t("capabilitiesTag")}</SectionTag>
          <h2
            id="about-capabilities-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("capabilitiesTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("capabilitiesSubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_CAPABILITIES.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.key}
                initial={{ opacity: 0, y: 28 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
              >
                <Link
                  href={cap.href}
                  className="group flex h-full flex-col rounded-3xl border border-logo-bg/10 bg-[#f8f9f5] p-7 transition-all hover:-translate-y-1.5 hover:border-primary/40 hover:bg-white hover:shadow-[0_20px_52px_rgba(52,52,50,0.12)]"
                >
                  <span
                    className="flex h-13 w-13 items-center justify-center rounded-2xl p-3 text-logo-bg shadow-sm"
                    style={{ background: cap.accent }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-5 flex items-center gap-2 text-lg font-extrabold text-logo-bg">
                    {t(`${cap.key}Title`)}
                    <ArrowUpRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/65">
                    {t(`${cap.key}Desc`)}
                  </p>
                  <span className="mt-4 text-sm font-bold text-primary">
                    {t("capabilitiesLink")}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
