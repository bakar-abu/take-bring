"use client";

import { siteConfig } from "@/config/site";
import type { Locale } from "@/types/locale";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const locales = siteConfig.locales as readonly Locale[];

const localeFlags: Record<Locale, string> = {
  de: "🇩🇪",
  en: "🇬🇧",
  ro: "🇷🇴",
};

export function LocaleDropdown() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("locale");
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
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-lg border border-primary-light/60 bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary-light/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("selectLanguage")}
      >
        <span className="text-lg leading-none" aria-hidden>
          {localeFlags[locale]}
        </span>
        <span className="hidden sm:inline">{t(locale)}</span>
        <i
          className={cn(
            "ri-arrow-down-s-line text-base transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 min-w-[150px] rounded-lg border border-primary-light/25 bg-background py-1 shadow-lg"
        >
          {locales.map((loc) => (
            <li key={loc} role="option" aria-selected={locale === loc}>
              <Link
                href={pathname}
                locale={loc}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-primary-light/30",
                  locale === loc && "bg-primary-light/30 font-medium",
                )}
              >
                <span aria-hidden>{localeFlags[loc]}</span>
                {t(loc)}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
