"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Package, Ruler, Sparkles, Thermometer, Weight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FleetItem, ServiceConfig } from "@/config/services";

const EASE = [0.22, 1, 0.36, 1] as const;

function FleetCard({
  item,
  index,
  serviceId,
  variant,
}: {
  item: FleetItem;
  index: number;
  serviceId: ServiceConfig["id"];
  variant: ServiceConfig["fleetVariant"];
}) {
  const t = useTranslations(`servicesPages.${serviceId}`);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const frostBorder = variant === "reefer";

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12, ease: EASE }}
      className={`group relative ${item.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
    >
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_12px_48px_rgba(52,52,50,0.1)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_64px_rgba(52,52,50,0.16)] ${
          item.popular
            ? "border-primary ring-2 ring-primary/30"
            : frostBorder
              ? "border-[#7ec8e3]/40 hover:border-[#7ec8e3]"
              : "border-logo-bg/10 hover:border-primary/40"
        }`}
      >
        {item.popular ? (
          <div className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-logo-bg shadow-lg">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
            {t("fleetPopular")}
          </div>
        ) : null}

        <div className="relative aspect-[4/3] overflow-hidden bg-logo-bg/5">
          <Image
            src={item.image}
            alt={t(`${item.id}Name`)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {variant === "reefer" ? (
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#7ec8e3] px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              <Thermometer className="h-3.5 w-3.5" />
              {t(`${item.id}Temp`)}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-extrabold text-logo-bg">{t(`${item.id}Name`)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/65">
            {t(`${item.id}Desc`)}
          </p>
          <div className="mt-4 grid gap-2">
            {(["Spec1", "Spec2", "Spec3"] as const).map((suffix) => {
              const specKey = `${item.id}${suffix}`;
              if (!t.has(specKey as never)) return null;
              const Icon =
                suffix === "Spec1" ? Weight : suffix === "Spec2" ? Ruler : Package;
              return (
                <div
                  key={specKey}
                  className="flex items-center gap-2 rounded-xl border border-logo-bg/8 bg-[#f8f9f5] px-3 py-2 text-xs font-semibold text-logo-bg"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {t(specKey as never)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ServiceFleet({ config }: { config: ServiceConfig }) {
  const t = useTranslations(`servicesPages.${config.id}`);
  const [activeTab, setActiveTab] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const gridClass =
    config.fleetVariant === "compact"
      ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      : "grid gap-8 lg:grid-cols-3";

  return (
    <section
      className="bg-[#f4f7f6] py-16 md:py-24"
      aria-labelledby="service-fleet-heading"
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
            {t("fleetTag")}
          </p>
          <h2
            id="service-fleet-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("fleetTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("fleetSubtitle")}
          </p>
        </motion.div>

        {config.fleetVariant === "tabs" ? (
          <>
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {config.fleetItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    activeTab === index
                      ? "bg-logo-bg text-white shadow-md"
                      : "bg-white text-logo-bg hover:bg-primary/20"
                  }`}
                >
                  {item.tabKey ? t(item.tabKey) : t(`${item.id}Name`)}
                </button>
              ))}
            </div>
            <div className="mx-auto max-w-lg">
              <FleetCard
                item={config.fleetItems[activeTab]}
                index={0}
                serviceId={config.id}
                variant={config.fleetVariant}
              />
            </div>
          </>
        ) : (
          <div className={gridClass}>
            {config.fleetItems.map((item, index) => (
              <FleetCard
                key={item.id}
                item={item}
                index={index}
                serviceId={config.id}
                variant={config.fleetVariant}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
