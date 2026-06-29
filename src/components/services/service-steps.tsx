"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ServiceConfig } from "@/config/services";

const EASE = [0.22, 1, 0.36, 1] as const;

function VerticalStep({
  Icon,
  index,
  title,
  description,
  isLast,
}: {
  Icon: React.ElementType;
  index: number;
  title: string;
  description: string;
  isLast: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className="relative flex gap-5 sm:gap-8"
    >
      <div className="flex flex-col items-center">
        <div className="relative shrink-0">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-logo-bg text-white shadow-[0_8px_24px_rgba(52,52,50,0.2)] sm:h-16 sm:w-16">
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} aria-hidden />
          </span>
          <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-sm">
            {index + 1}
          </span>
        </div>
        {!isLast ? (
          <div className="mt-3 min-h-[2rem] w-px flex-1 bg-primary/30" aria-hidden />
        ) : null}
      </div>
      <article className="group mb-8 flex-1 rounded-2xl border border-logo-bg/8 bg-white p-5 shadow-[0_8px_32px_rgba(52,52,50,0.06)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_16px_48px_rgba(52,52,50,0.1)] sm:mb-10 sm:p-7">
        <span className="font-mono text-xs font-bold text-primary/80">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-2 text-lg font-extrabold text-logo-bg sm:text-xl">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/65 sm:text-base">
          {description}
        </p>
        <div className="mt-4 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-16" />
      </article>
    </motion.li>
  );
}

function HorizontalStep({
  Icon,
  index,
  title,
  description,
  total,
}: {
  Icon: React.ElementType;
  index: number;
  title: string;
  description: string;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className="relative flex min-w-[220px] flex-1 flex-col items-center text-center"
    >
      {index < total - 1 ? (
        <div
          className="absolute left-[calc(50%+2rem)] top-8 hidden h-0.5 w-[calc(100%-4rem)] bg-primary/30 lg:block"
          aria-hidden
        />
      ) : null}
      <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-logo-bg text-white shadow-lg">
        <Icon className="h-7 w-7" strokeWidth={1.8} />
        <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
          {index + 1}
        </span>
      </span>
      <h3 className="mt-4 text-base font-extrabold text-logo-bg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/65">{description}</p>
    </motion.div>
  );
}

export function ServiceSteps({ config }: { config: ServiceConfig }) {
  const t = useTranslations(`servicesPages.${config.id}`);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const steps = Array.from({ length: config.stepCount }, (_, i) => `step${i + 1}`);

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="service-steps-heading">
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
            {t("stepsTag")}
          </p>
          <h2
            id="service-steps-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("stepsTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("stepsSubtitle")}
          </p>
        </motion.div>

        {config.stepsVariant === "horizontal" ? (
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-4">
            {steps.map((key, index) => {
              const Icon = config.stepIcons[index] ?? config.stepIcons[0];
              return (
                <HorizontalStep
                  key={key}
                  Icon={Icon}
                  index={index}
                  title={t(`${key}Title`)}
                  description={t(`${key}Desc`)}
                  total={steps.length}
                />
              );
            })}
          </div>
        ) : (
          <ol className="mx-auto max-w-3xl list-none">
            {steps.map((key, index) => {
              const Icon = config.stepIcons[index] ?? config.stepIcons[0];
              return (
                <VerticalStep
                  key={key}
                  Icon={Icon}
                  index={index}
                  title={t(`${key}Title`)}
                  description={t(`${key}Desc`)}
                  isLast={index === steps.length - 1}
                />
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
