"use client";

import { serviceLinks } from "@/config/navigation";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export function ServicesDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const tNav = useTranslations("nav");
  const tServices = useTranslations("servicesDropdown");
  const pathname = usePathname();
  const isServicesActive = serviceLinks.some(
    (service) =>
      pathname === service.href || pathname.startsWith(`${service.href}/`),
  );
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        onMouseEnter={() => setOpen(true)}
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
        <div
          className="absolute left-0 top-full z-50 mt-2 min-w-[280px] max-w-[min(96vw,360px)] rounded-xl border-2 border-primary-light/25 bg-background p-3 shadow-xl"
          onMouseLeave={() => setOpen(false)}
        >
          <h3 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-foreground">
            {tServices("coreHeading")}
          </h3>
          <ul className="space-y-1">
            {serviceLinks.map((service) => {
              const isActive =
                pathname === service.href ||
                pathname.startsWith(`${service.href}/`);

              return (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors",
                      isActive
                        ? "border-primary/35 bg-primary-light/10"
                        : "border-transparent hover:border-primary/30 hover:bg-primary-light/10",
                    )}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                  >
                    <i
                      className={cn(service.icon, "shrink-0 text-base text-primary")}
                      aria-hidden
                    />
                    <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                      {tServices(service.labelKey)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
