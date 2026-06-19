"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import type { AppPathname } from "@/config/navigation";
import { serviceLinks } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  MapPin,
  Package,
  Snowflake,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MegaService = {
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
};

const MEGA_SERVICES: MegaService[] = [
  {
    id: "courier",
    Icon: Package,
    titleKey: "expressCourierTitle",
    descKey: "expressCourierDesc",
    featurePrefix: "expressCourierFeature",
    href: "/kuriertransporte",
  },
  {
    id: "fixed-routes",
    Icon: Truck,
    titleKey: "expressDirectTitle",
    descKey: "expressDirectDesc",
    featurePrefix: "expressDirectFeature",
    href: "/spedition-lkw",
  },
  {
    id: "local",
    Icon: MapPin,
    titleKey: "localDeliveriesTitle",
    descKey: "localDeliveriesDesc",
    featurePrefix: "localDeliveriesFeature",
    href: "/kuriertransporte",
  },
  {
    id: "refrigerated",
    Icon: Snowflake,
    titleKey: "refrigeratedTitle",
    descKey: "refrigeratedDesc",
    featurePrefix: "refrigeratedFeature",
    href: "/kuehltransporte",
  },
];

export function ServicesDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const tNav = useTranslations("nav");
  const tServices = useTranslations("servicesSection");
  const pathname = usePathname();
  const isServicesActive = serviceLinks.some(
    (service) =>
      pathname === service.href || pathname.startsWith(`${service.href}/`),
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const current = MEGA_SERVICES[active];
  const ActiveIcon = current.Icon;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div
      className="static md:relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex items-center gap-1 rounded-t-md px-4 py-2 text-xs font-medium sm:text-sm",
          open || isServicesActive
            ? "bg-primary text-background"
            : "text-foreground hover:bg-primary-light/30",
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {tNav("services")}
        <i
          className={cn(
            "ri-arrow-down-s-line text-base transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Mobile: compact service links */}
      {open ? (
        <ul className="mt-2 space-y-1 md:hidden">
          {MEGA_SERVICES.map((service) => (
            <li key={service.id}>
              <Link
                href={service.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-primary-light/20"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                {tServices(service.titleKey)}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-full z-50 hidden w-screen max-w-none -translate-x-1/2 border-t border-primary-light/20 bg-white shadow-2xl md:block"
          >
            <div className="container-content px-4 py-5 lg:px-8">
              <div className="overflow-hidden rounded-2xl border border-logo-bg/10 lg:grid lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)]">
                <div className="bg-logo-bg px-4 py-5 md:px-5 md:py-6">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-light">
                    {tServices("expressServicesTag")}
                  </p>
                  <nav className="space-y-1.5" aria-label={tNav("services")}>
                    {MEGA_SERVICES.map((service, index) => {
                      const Icon = service.Icon;
                      const isActive = index === active;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setActive(index)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                            isActive
                              ? "bg-white/10 text-white ring-1 ring-white/15"
                              : "text-white/75 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              isActive
                                ? "bg-primary text-logo-bg"
                                : "bg-white/10",
                            )}
                          >
                            <Icon className="h-4 w-4" strokeWidth={2} />
                          </span>
                          <span className="font-semibold">
                            {tServices(service.titleKey)}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="min-w-0 bg-white px-5 py-6 md:px-8 md:py-7">
                  <div className="mb-4 flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <ActiveIcon className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-logo-bg md:text-2xl">
                        {tServices(current.titleKey)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/65 md:text-base">
                        {tServices(current.descKey)}
                      </p>
                    </div>
                  </div>

                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 rounded-lg border border-logo-bg/8 bg-[#f8f9f5] px-3 py-2.5 text-sm text-foreground/80"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          strokeWidth={2.5}
                        />
                        <span>{tServices(`${current.featurePrefix}${i}`)}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={current.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-logo-bg transition-colors hover:text-primary"
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                  >
                    {tServices("readMore")}
                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
