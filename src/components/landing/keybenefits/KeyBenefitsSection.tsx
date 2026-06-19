"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

const BENEFITS = [
  {
    key: "benefit1",
    image: "/images/benefit-reliability.webp",
    accent: "#abc629",
    glow: "rgba(171, 198, 41, 0.35)",
  },
  {
    key: "benefit2",
    image: "/images/benefit-flexibility.webp",
    accent: "#e67e22",
    glow: "rgba(230, 126, 34, 0.3)",
  },
  {
    key: "benefit3",
    image: "/images/benefit-expertise.webp",
    accent: "#3498db",
    glow: "rgba(52, 152, 219, 0.3)",
  },
  {
    key: "benefit4",
    image: "/images/benefit-support.webp",
    accent: "#9b59b6",
    glow: "rgba(155, 89, 182, 0.3)",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

function BenefitCard({
  benefit,
  index,
  title,
  description,
}: {
  benefit: (typeof BENEFITS)[number];
  index: number;
  title: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: EASE }}
      className="group relative"
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-logo-bg/8 bg-logo-bg/10 p-6 shadow-[0_8px_40px_rgba(52,52,50,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_24px_56px_rgba(52,52,50,0.14)] md:p-8"
        style={{
          boxShadow: inView ? undefined : undefined,
        }}
      >
        {/* Accent top bar */}
        <div
          className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
          style={{ background: benefit.accent }}
        />

        {/* Glow behind icon */}
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: benefit.glow }}
          aria-hidden
        />

        {/* Number */}
        <span className="mb-4 font-mono text-sm font-bold text-primary/80">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Generated icon */}
        <div className="relative mb-6 flex justify-center">
          <div
            className="relative h-28 w-28 overflow-hidden rounded-2xl ring-1 ring-logo-bg/10 transition-all duration-500 group-hover:scale-105 group-hover:ring-primary/30 md:h-32 md:w-32"
            style={{
              boxShadow: `0 12px 32px ${benefit.glow}`,
            }}
          >
            <Image
              src={benefit.image}
              alt={title}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        </div>

        <h3 className="text-center text-xl font-extrabold text-logo-bg md:text-2xl">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-center text-sm leading-relaxed text-foreground/65 md:text-base">
          {description}
        </p>

        {/* Bottom accent dot */}
        <div className="mt-6 flex justify-center">
          <span
            className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-150"
            style={{ background: benefit.accent }}
            aria-hidden
          />
        </div>
      </div>
    </motion.article>
  );
}

export function KeyBenefitsSection() {
  const t = useTranslations("keyBenefitsSection");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      aria-labelledby="key-benefits-heading"
    >
 

      <div className="container-content relative px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-14 max-w-2xl text-center md:mb-16"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("tag")}
          </p>
          <h2
            id="key-benefits-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl lg:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65 md:text-lg">
            {t("subtitle")}
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-primary" aria-hidden />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {BENEFITS.map((benefit, index) => (
            <BenefitCard
              key={benefit.key}
              benefit={benefit}
              index={index}
              title={t(`${benefit.key}Title`)}
              description={t(`${benefit.key}Description`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
