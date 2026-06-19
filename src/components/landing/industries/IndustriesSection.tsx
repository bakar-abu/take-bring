"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

const ITEMS = [
  { key: "item1", image: "/images/industry-retail.webp" },
  { key: "item2", image: "/images/industry-manufacturing.webp" },
  { key: "item3", image: "/images/industry-food.webp" },
  { key: "item4", image: "/images/industry-healthcare.webp" },
  { key: "item5", image: "/images/industry-automotive.webp" },
  { key: "item6", image: "/images/industry-construction.webp" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function IndustriesSection() {
  const t = useTranslations("industriesSection");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-white py-20 md:py-24"
      aria-labelledby="industries-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("tag")}
          </p>
          <h2
            id="industries-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {ITEMS.map(({ key, image }, index) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
              className="group flex flex-col items-center rounded-2xl border border-logo-bg/8 bg-logo-bg/5 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:p-5"
            >
              <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-2xl ring-1 ring-logo-bg/10 transition-all group-hover:ring-primary/30 sm:h-20 sm:w-20">
                <Image
                  src={image}
                  alt={t(key)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="80px"
                />
              </div>
              <h3 className="text-xs font-bold leading-snug text-logo-bg sm:text-sm">
                {t(key)}
              </h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
