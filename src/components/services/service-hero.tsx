"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ServiceConfig } from "@/config/services";

const EASE = [0.22, 1, 0.36, 1] as const;

function scrollToLeadForm() {
  document.getElementById("service-lead-form")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function HeroContent({
  serviceId,
  variant,
  heroImage,
}: {
  serviceId: ServiceConfig["id"];
  variant: ServiceConfig["heroVariant"];
  heroImage: string;
}) {
  const t = useTranslations(`servicesPages.${serviceId}`);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const ctaButton = (
    <button
      type="button"
      onClick={scrollToLeadForm}
      className="cta-delivery-btn inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold shadow-md"
    >
      <i className="ri-truck-line text-lg" aria-hidden />
      {t("heroCta")}
    </button>
  );

  if (variant === "split") {
    return (
      <div className="container-content relative z-10 flex min-h-[50vh] items-center px-4 py-20 md:min-h-[55vh] md:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-light">
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              {t("heroTag")}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8">{ctaButton}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
            className="relative hidden min-h-[280px] lg:block"
          >
            <div
              className="relative h-full min-h-[280px] overflow-hidden rounded-3xl shadow-2xl"
              style={{ clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0 100%)" }}
            >
              <Image
                src={heroImage}
                alt={t("heroTitle")}
                fill
                className="object-cover"
                sizes="50vw"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (variant === "centered") {
    return (
      <div className="container-content relative z-10 flex min-h-[50vh] flex-col items-center justify-center px-4 py-20 text-center md:min-h-[55vh] md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-light">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("heroTag")}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
            {t("heroSubtitle")}
          </p>
          <div className="mt-8 flex justify-center">{ctaButton}</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-content relative z-10 flex min-h-[50vh] flex-col justify-center px-4 py-20 md:min-h-[55vh] md:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: EASE }}
        className="max-w-3xl"
      >
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-light">
          <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
          <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
          {t("heroTag")}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
          {t("heroSubtitle")}
        </p>
        <div className="mt-8">{ctaButton}</div>
      </motion.div>
    </div>
  );
}

export function ServiceHero({ config }: { config: ServiceConfig }) {
  const t = useTranslations(`servicesPages.${config.id}`);

  return (
    <section className="relative overflow-hidden" aria-labelledby="service-hero-heading">
      <div className="absolute inset-0">
        <Image
          src={config.heroImage}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0 bg-logo-bg/55"
          style={
            config.id === "refrigerated"
              ? { background: "linear-gradient(135deg, rgba(52,52,50,0.65), rgba(52,152,219,0.25))" }
              : undefined
          }
          aria-hidden
        />
      </div>
      <span id="service-hero-heading" className="sr-only">
        {t("heroTitle")}
      </span>
      <HeroContent
        serviceId={config.id}
        variant={config.heroVariant}
        heroImage={config.heroImage}
      />
    </section>
  );
}

export function ServiceStatsRow({ serviceId }: { serviceId: ServiceConfig["id"] }) {
  const t = useTranslations(`servicesPages.${serviceId}`);
  const stats = ["stat1", "stat2", "stat3"] as const;

  return (
    <div className="border-b border-logo-bg/10 bg-white py-8">
      <div className="container-content grid gap-6 px-4 sm:grid-cols-3 md:px-8">
        {stats.map((key) => (
          <div key={key} className="text-center">
            <p className="text-2xl font-extrabold text-primary md:text-3xl">
              {t(`${key}Value`)}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground/60">
              {t(`${key}Label`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
