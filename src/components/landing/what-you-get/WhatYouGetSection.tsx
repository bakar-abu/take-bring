"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { MapPin, Truck, Zap, Route, Calendar, BarChart3 } from "lucide-react";

const ITEMS = [
  { key: "item1", Icon: MapPin },
  { key: "item2", Icon: Truck },
  { key: "item3", Icon: Zap },
  { key: "item4", Icon: Route },
  { key: "item5", Icon: Calendar },
  { key: "item6", Icon: BarChart3 },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function WhatYouGetSection() {
  const t = useTranslations("whatYouGetSection");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative overflow-hidden bg-logo-bg py-20 md:py-28"
      aria-labelledby="what-you-get-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #abc629 0, #abc629 1px, transparent 0, transparent 50%)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <div className="container-content relative px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("tag")}
          </p>
          <h2
            id="what-you-get-heading"
            className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            {t("title")}
          </h2>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-primary" aria-hidden />
          <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {ITEMS.map(({ key, Icon }, index) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: EASE }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-white/10 md:p-8"
            >
              <span className="font-mono text-xs font-bold text-primary/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                <Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">
                {t(`${key}Title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65 transition-colors group-hover:text-white/80">
                {t(`${key}Description`)}
              </p>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
