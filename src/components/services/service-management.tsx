"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ServiceConfig } from "@/config/services";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ServiceManagement({ config }: { config: ServiceConfig }) {
  const t = useTranslations(`servicesPages.${config.id}`);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-[#f4f7f6] py-16 md:py-24"
      aria-labelledby="service-management-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("manageTag")}
          </p>
          <h2
            id="service-management-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("manageTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("manageSubtitle")}
          </p>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative min-h-[280px] overflow-hidden rounded-3xl shadow-2xl md:min-h-[380px]">
            <Image
              src={config.operationsImage}
              alt={t("manageTitle")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-logo-bg/50 via-transparent to-transparent" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {config.manageFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
                  className="rounded-2xl border border-logo-bg/10 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <h3 className="mt-3 text-base font-extrabold text-logo-bg">
                    {t(`${feature.id}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                    {t(`${feature.id}Text`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
