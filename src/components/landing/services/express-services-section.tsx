"use client";

import React, { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  MapPin,
  Package,
  Snowflake,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { AppPathname } from "@/config/navigation";

type ExpressService = {
  id: string;
  Icon: LucideIcon;
  titleKey:
    | "expressCourierTitle"
    | "expressDirectTitle"
    | "localDeliveriesTitle"
    | "refrigeratedTitle";
  descKey:
    | "expressCourierDesc"
    | "expressDirectDesc"
    | "localDeliveriesDesc"
    | "refrigeratedDesc";
  featurePrefix:
    | "expressCourierFeature"
    | "expressDirectFeature"
    | "localDeliveriesFeature"
    | "refrigeratedFeature";
  href: AppPathname;
  accent: string;
};

const EXPRESS_SERVICES: ExpressService[] = [
  {
    id: "courier",
    Icon: Package,
    titleKey: "expressCourierTitle",
    descKey: "expressCourierDesc",
    featurePrefix: "expressCourierFeature",
    href: "/kuriertransporte",
    accent: "#abc629",
  },
  {
    id: "fixed-routes",
    Icon: Truck,
    titleKey: "expressDirectTitle",
    descKey: "expressDirectDesc",
    featurePrefix: "expressDirectFeature",
    href: "/spedition-lkw",
    accent: "#e67e22",
  },
  {
    id: "local",
    Icon: MapPin,
    titleKey: "localDeliveriesTitle",
    descKey: "localDeliveriesDesc",
    featurePrefix: "localDeliveriesFeature",
    href: "/kuriertransporte",
    accent: "#3498db",
  },
  {
    id: "refrigerated",
    Icon: Snowflake,
    titleKey: "refrigeratedTitle",
    descKey: "refrigeratedDesc",
    featurePrefix: "refrigeratedFeature",
    href: "/kuehltransporte",
    accent: "#5dade2",
  },
];

export function ExpressServicesSection() {
  const t = useTranslations("servicesSection");
  const [active, setActive] = useState(0);
  const current = EXPRESS_SERVICES[active];
  const ActiveIcon = current.Icon;

  return (
    <section
      className="relative overflow-hidden bg-[#f0f2eb] py-16 md:py-24"
      aria-labelledby="express-services-heading"
    >
      {/* Decorative speed lines */}
      <div
        className="pointer-events-none absolute -right-24 top-0 h-full w-1/2 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(-12deg, #343432 0px, #343432 2px, transparent 2px, transparent 28px)",
        }}
      />

      <div className="container-content relative px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_32px_80px_rgba(52,52,50,0.12)] lg:grid lg:grid-cols-[minmax(300px,380px)_1fr]">
          {/* Left — dark headline + tab nav */}
          <div className="relative bg-logo-bg px-6 py-10 text-white md:px-8 md:py-12 lg:py-14">
            <div
              className="pointer-events-none absolute -right-16 top-0 h-full w-32 skew-x-[-8deg] bg-primary/20"
              aria-hidden
            />

            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-light">
              <Zap className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
              {t("expressServicesTag")}
            </p>

            <h2
              id="express-services-heading"
              className="text-3xl font-extrabold leading-tight md:text-4xl"
            >
              {t("expressServicesTitle")}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-[15px]">
              {t("expressServicesSubtitle")}
            </p>

            <nav
              className="mt-10 space-y-2"
              aria-label={t("expressServicesTag")}
            >
              {EXPRESS_SERVICES.map((service, index) => {
                const Icon = service.Icon;
                const isActive = index === active;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 text-left transition-all duration-300 ${
                      isActive
                        ? "bg-white/10 shadow-inner ring-1 ring-white/20"
                        : "hover:bg-white/5"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="express-active-bar"
                        className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive ? "bg-primary text-logo-bg" : "bg-white/10 text-white/80"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-sm font-semibold ${
                          isActive ? "text-white" : "text-white/75"
                        }`}
                      >
                        {t(service.titleKey)}
                      </span>
                    </span>
                    <ArrowRight
                      className={`h-4 w-4 flex-shrink-0 transition-all ${
                        isActive
                          ? "translate-x-0 text-primary opacity-100"
                          : "translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            <Link
              href="/kontakt"
              className="cta-delivery-btn mt-10 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold shadow-lg sm:w-auto"
            >
              {t("getQuote")}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Right — animated detail panel */}
          <div className="relative flex min-h-[420px] flex-col justify-center px-6 py-10 md:px-10 md:py-12 lg:px-12">
            <div
              className="pointer-events-none absolute right-8 top-8 font-mono text-[120px] font-black leading-none text-logo-bg/[0.04]"
              aria-hidden
            >
              {String(active + 1).padStart(2, "0")}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-6 flex items-start gap-5">
                  <div
                    className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl shadow-lg"
                    style={{ background: `${current.accent}22`, color: current.accent }}
                  >
                    <ActiveIcon className="h-8 w-8" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-logo-bg md:text-3xl">
                      {t(current.titleKey)}
                    </h3>
                    <div
                      className="mt-2 h-1 w-16 rounded-full"
                      style={{ background: current.accent }}
                    />
                  </div>
                </div>

                <p className="max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg">
                  {t(current.descKey)}
                </p>

                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl border border-logo-bg/8 bg-[#f8f9f5] px-4 py-3 text-sm text-foreground/80"
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${current.accent}25`, color: current.accent }}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span>{t(`${current.featurePrefix}${i}`)}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={current.href}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-logo-bg transition-colors hover:text-primary"
                >
                  {t("readMore")}
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
