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
  Package,
  Route,
  Ship,
  Snowflake,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SERVICE_ICONS: Record<(typeof serviceLinks)[number]["labelKey"], LucideIcon> = {
  courier: Package,
  freight: Truck,
  refrigerated: Snowflake,
  regularTours: Route,
  international: Ship,
};

const SERVICE_FEATURES: Record<
  (typeof serviceLinks)[number]["labelKey"],
  [string, string, string, string]
> = {
  courier: [
    "expressCourierFeature1",
    "expressCourierFeature2",
    "expressCourierFeature3",
    "expressCourierFeature4",
  ],
  freight: [
    "expressDirectFeature1",
    "expressDirectFeature2",
    "expressDirectFeature3",
    "expressDirectFeature4",
  ],
  refrigerated: [
    "refrigeratedFeature1",
    "refrigeratedFeature2",
    "refrigeratedFeature3",
    "refrigeratedFeature4",
  ],
  regularTours: [
    "expressDirectFeature1",
    "expressDirectFeature2",
    "expressDirectFeature3",
    "expressDirectFeature4",
  ],
  international: [
    "expressDirectFeature1",
    "expressDirectFeature2",
    "expressDirectFeature3",
    "expressDirectFeature4",
  ],
};

const SERVICE_DESC_KEYS: Record<
  (typeof serviceLinks)[number]["labelKey"],
  string
> = {
  courier: "expressCourierDesc",
  freight: "offerFreightDesc",
  refrigerated: "refrigeratedDesc",
  regularTours: "offerFixedRoutesDesc",
  international: "offerInternationalDesc",
};

function useHeaderBottom() {
  const [top, setTop] = useState(0);

  const update = useCallback(() => {
    const header = document.querySelector("header");
    if (header) {
      setTop(header.getBoundingClientRect().bottom);
    }
  }, []);

  return { top, update };
}

export function ServicesDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const tNav = useTranslations("nav");
  const tServices = useTranslations("servicesSection");
  const tDropdown = useTranslations("servicesDropdown");
  const pathname = usePathname();
  const isServicesActive = serviceLinks.some(
    (service) =>
      pathname === service.href || pathname.startsWith(`${service.href}/`),
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { top: menuTop, update: updateMenuTop } = useHeaderBottom();

  const current = serviceLinks[active];
  const ActiveIcon = SERVICE_ICONS[current.labelKey];
  const features = SERVICE_FEATURES[current.labelKey];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        const panel = document.getElementById("services-mega-menu");
        if (panel && panel.contains(e.target as Node)) return;
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    updateMenuTop();
    window.addEventListener("resize", updateMenuTop);
    window.addEventListener("scroll", updateMenuTop, { passive: true });
    return () => {
      window.removeEventListener("resize", updateMenuTop);
      window.removeEventListener("scroll", updateMenuTop);
    };
  }, [open, updateMenuTop]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  const megaMenu = open ? (
    <>
      <motion.div
        key="services-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[90] hidden bg-logo-bg/20 md:block"
        aria-hidden
        onClick={() => setOpen(false)}
      />
      <motion.div
        key="services-mega-menu"
        id="services-mega-menu"
        role="menu"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="fixed left-0 right-0 z-[100] hidden border-t border-primary-light/20 bg-white shadow-2xl md:block"
        style={{ top: menuTop }}
      >
          <div className="container-content px-4 py-5 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-logo-bg/10 lg:grid lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)]">
              <div className="bg-logo-bg px-4 py-5 md:px-5 md:py-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-light">
                  {tDropdown("coreHeading")}
                </p>
                <nav className="space-y-1.5" aria-label={tNav("services")}>
                  {serviceLinks.map((service, index) => {
                    const Icon = SERVICE_ICONS[service.labelKey];
                    const isActive = index === active;
                    const isCurrentPage =
                      pathname === service.href ||
                      pathname.startsWith(`${service.href}/`);

                    return (
                      <Link
                        key={service.href}
                        href={service.href as AppPathname}
                        role="menuitem"
                        onMouseEnter={() => setActive(index)}
                        onFocus={() => setActive(index)}
                        onClick={close}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                          isActive || isCurrentPage
                            ? "bg-white/10 text-white ring-1 ring-white/15"
                            : "text-white/75 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            isActive || isCurrentPage
                              ? "bg-primary text-logo-bg"
                              : "bg-white/10",
                          )}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2} />
                        </span>
                        <span className="font-semibold">
                          {tDropdown(service.labelKey)}
                        </span>
                      </Link>
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
                      {tDropdown(current.labelKey)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/65 md:text-base">
                      {tServices(SERVICE_DESC_KEYS[current.labelKey] as never)}
                    </p>
                  </div>
                </div>

                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {features.map((featureKey) => (
                    <li
                      key={featureKey}
                      className="flex items-start gap-2 rounded-lg border border-logo-bg/8 bg-[#f8f9f5] px-3 py-2.5 text-sm text-foreground/80"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        strokeWidth={2.5}
                      />
                      <span>{tServices(featureKey as never)}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={current.href as AppPathname}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-logo-bg transition-colors hover:text-primary"
                  onClick={close}
                >
                  {tServices("readMore")}
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    ) : null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((value) => {
            const next = !value;
            if (next) updateMenuTop();
            return next;
          });
        }}
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

      {open ? (
        <ul className="mt-2 space-y-1 md:hidden">
          <li className="px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-logo-bg/50">
            {tDropdown("coreHeading")}
          </li>
          {serviceLinks.map((service) => {
            const Icon = SERVICE_ICONS[service.labelKey];
            return (
              <li key={service.href}>
                <Link
                  href={service.href as AppPathname}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary-light/20"
                  onClick={close}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  {tDropdown(service.labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}

      {mounted
        ? createPortal(
            <AnimatePresence>{megaMenu}</AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
