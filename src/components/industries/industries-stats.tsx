"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { STATS } from "@/config/industries-page";

const EASE = [0.22, 1, 0.36, 1] as const;

export function IndustriesStats() {
  const t = useTranslations("industriesPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      className="relative overflow-hidden border-b border-logo-bg/10 bg-logo-bg py-10 md:py-12"
      aria-label="Industry logistics statistics"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(171,198,41,0.12),transparent_50%)]" />
      <div className="container-content relative px-4 md:px-8">
        <div
          ref={ref}
          className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
        >
          {STATS.map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.1, ease: EASE }}
              className="text-center"
            >
              <p className="text-3xl font-extrabold text-primary md:text-4xl lg:text-5xl">
                {t(`${key}Value`)}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/70 md:text-sm">
                {t(`${key}Label`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
