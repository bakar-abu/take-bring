"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { CASE_STUDIES } from "@/config/case-studies";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CaseStudiesSection() {
  const t = useTranslations("caseStudiesSection");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-[#f4f7f6] py-20 md:py-28"
      aria-labelledby="case-studies-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("tag")}
          </p>
          <h2
            id="case-studies-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65 md:text-lg">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3" role="list">
          {CASE_STUDIES.map((caseItem, index) => (
            <motion.article
              key={caseItem.id}
              role="listitem"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-logo-bg/8 bg-white shadow-[0_8px_40px_rgba(52,52,50,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_24px_56px_rgba(52,52,50,0.14)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={caseItem.image}
                  alt={t(`${caseItem.id}Industry`)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute right-4 top-4 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                  {t(`${caseItem.id}Result`)}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="inline-flex w-fit rounded-md bg-primary/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-dark">
                  {t(`${caseItem.id}Industry`)}
                </span>
                <h3 className="mt-4 text-lg font-extrabold leading-snug text-logo-bg">
                  {t(`${caseItem.id}Title`)}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/65">
                  {t(`${caseItem.id}Description`)}
                </p>
                <Link
                  href="/kontakt"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-logo-bg transition-colors hover:text-primary"
                >
                  {t("readMore")}
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <Link
            href="/kontakt"
            className="cta-delivery-btn inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold shadow-md"
          >
            {t("bookOrder")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
