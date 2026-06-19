"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Package, Ruler, Sparkles, Weight } from "lucide-react";

const TRUCKS = [
  {
    id: "truck1",
    size: "7.5t",
    image: "/images/fleet-truck-7-5t.webp",
    popular: false,
  },
  {
    id: "truck2",
    size: "12t",
    image: "/images/fleet-truck-12t.webp",
    popular: true,
  },
  {
    id: "truck3",
    size: "40t",
    image: "/images/fleet-truck-40t.webp",
    popular: false,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

function SpecRow({
  icon: Icon,
  label,
  value,
  extra,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  extra?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-logo-bg/8 bg-[#f8f9f5] px-4 py-3">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/45">
          {label}
        </p>
        <p className="text-sm font-bold text-logo-bg">
          {value}
          {extra ? (
            <span className="ml-1 text-xs font-medium text-foreground/55">
              ({extra})
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

function FleetCard({
  truck,
  index,
  t,
}: {
  truck: (typeof TRUCKS)[number];
  index: number;
  t: ReturnType<typeof useTranslations<"warehouseSection">>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12, ease: EASE }}
      className={`group relative ${truck.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
    >
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_12px_48px_rgba(52,52,50,0.1)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_64px_rgba(52,52,50,0.16)] ${
          truck.popular
            ? "border-primary ring-2 ring-primary/30"
            : "border-logo-bg/10 hover:border-primary/40"
        }`}
      >
        {truck.popular ? (
          <div className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-logo-bg shadow-lg">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
            {t("popular")}
          </div>
        ) : null}

        {/* Fleet image */}
        <div className="relative h-52 overflow-hidden md:h-56">
          <Image
            src={truck.image}
            alt={t(`${truck.id}Title`)}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-logo-bg/90 via-logo-bg/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
            <h3 className="text-lg font-bold text-white md:text-xl">
              {t(`${truck.id}Title`)}
            </h3>
            <p className="mt-1 font-mono text-4xl font-black leading-none text-primary md:text-5xl">
              {truck.size}
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="flex flex-1 flex-col gap-2.5 p-5 md:p-6">
          <SpecRow
            icon={Package}
            label={t("maxCapacity")}
            value={t(`${truck.id}Pallets`)}
            extra={
              truck.id === "truck3" ? t(`${truck.id}PalletsStacked`) : undefined
            }
          />
          <SpecRow
            icon={Ruler}
            label={t("dimensions")}
            value={t(`${truck.id}Size`)}
          />
          <SpecRow
            icon={Weight}
            label={t("payload")}
            value={t(`${truck.id}Payload`)}
          />

          {truck.id !== "truck3" ? (
            <p className="mt-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2.5 text-center text-xs font-semibold text-logo-bg">
              {t("optional")}: {t(`${truck.id}Handling`)}
            </p>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export function WarehouseSection() {
  const t = useTranslations("warehouseSection");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#f6f7f2] to-white py-20 md:py-28"
      aria-labelledby="warehouse-heading"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden
      />

      <div className="container-content relative px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-14 max-w-3xl text-center md:mb-16"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("tag")}
          </p>
          <h2
            id="warehouse-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl lg:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65 md:text-lg">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3 lg:items-stretch lg:gap-6 xl:gap-8">
          {TRUCKS.map((truck, index) => (
            <FleetCard key={truck.id} truck={truck} index={index} t={t} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-14 text-center"
        >
          <Link
            href="/kontakt"
            className="cta-delivery-btn inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold shadow-xl"
          >
            {t("bookOrder")}
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
