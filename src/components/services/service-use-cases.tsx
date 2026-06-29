"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ServiceConfig } from "@/config/services";

const EASE = [0.22, 1, 0.36, 1] as const;
const USE_CASES = ["useCase1", "useCase2", "useCase3"] as const;

export function ServiceUseCases({ serviceId }: { serviceId: ServiceConfig["id"] }) {
  const t = useTranslations(`servicesPages.${serviceId}`);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-[#f4f7f6] py-16 md:py-24"
      aria-labelledby="service-use-cases-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("useCasesTag")}
          </p>
          <h2
            id="service-use-cases-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("useCasesTitle")}
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {USE_CASES.map((key, index) => (
            <UseCaseCard
              key={key}
              index={index}
              title={t(`${key}Title`)}
              description={t(`${key}Desc`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCaseCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.1, ease: EASE }}
      className="rounded-2xl border border-logo-bg/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg md:p-8"
    >
      <span className="font-mono text-sm font-bold text-primary">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-3 text-lg font-extrabold text-logo-bg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/65">{description}</p>
    </motion.article>
  );
}
