"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ServiceConfig } from "@/config/services";

const EASE = [0.22, 1, 0.36, 1] as const;
const ADVANTAGES = ["advantage1", "advantage2", "advantage3", "advantage4"] as const;

export function ServiceAdvantages({ config }: { config: ServiceConfig }) {
  const t = useTranslations(`servicesPages.${config.id}`);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="service-advantages-heading">
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
            {t("advantagesTag")}
          </p>
          <h2
            id="service-advantages-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("advantagesTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("advantagesSubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map((key, index) => (
            <AdvantageCard
              key={key}
              index={index}
              accent={config.accent}
              image={config.advantageImages[index]}
              title={t(`${key}Title`)}
              description={t(`${key}Desc`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AdvantageCard({
  index,
  accent,
  image,
  title,
  description,
}: {
  index: number;
  accent: string;
  image: string;
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
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-logo-bg/8 bg-logo-bg/5 p-6 shadow-[0_8px_40px_rgba(52,52,50,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_24px_56px_rgba(52,52,50,0.14)] md:p-7">
        <div
          className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
          style={{ background: accent }}
        />
        <span className="mb-4 font-mono text-sm font-bold text-primary/80">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative mb-5 h-24 w-24 overflow-hidden rounded-2xl ring-1 ring-logo-bg/10">
          <Image src={image} alt="" fill className="object-cover" sizes="96px" />
        </div>
        <h3 className="text-lg font-extrabold text-logo-bg">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/65">
          {description}
        </p>
      </div>
    </motion.article>
  );
}
