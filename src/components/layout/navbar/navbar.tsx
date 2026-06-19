"use client";

import takeBringLogo from "@/assets/images/take-bring-logo.png";
import { DeliveryCtaButton } from "@/components/ui/delivery-cta-button";
import { siteConfig } from "@/config/site";
import { Link, usePathname } from "@/lib/i18n/navigation";
import type { AppPathname } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LocaleDropdown } from "./locale-dropdown";
import { ServicesDropdown } from "./services-dropdown";

function NavbarLogo({
  className,
  imageClassName,
}: {
  className?: string;
  imageClassName?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("relative flex shrink-0 items-center", className)}
    >
      <Image
        src={takeBringLogo}
        alt={`${siteConfig.name} logo`}
        priority
        className={cn("h-8 w-auto object-contain object-left md:h-14", imageClassName)}
      />
    </Link>
  );
}

function NavLink({
  href,
  children,
  className = "",
  onClick,
}: {
  href: AppPathname | `#${string}`;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : !href.startsWith("#") &&
        (pathname === href || pathname.startsWith(`${href}/`));

  const classes = cn(
    "rounded-t-md px-4 py-2 text-xs font-medium sm:text-sm",
    isActive
      ? "bg-primary text-background shadow-sm"
      : "text-foreground hover:bg-primary-light/30",
    className,
  );

  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href as AppPathname}
      className={classes}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-background shadow">
      {/* Top bar */}
      <div className="hidden border-b border-primary-light/10 md:block">
        <div className="container-content flex w-full flex-col md:flex-row md:items-stretch">
          <div className="flex w-full items-center bg-logo-bg py-2 pl-4 md:w-[30%] md:py-3 lg:pl-8">
            <NavbarLogo className="h-14 w-full" imageClassName="h-14 max-w-[220px]" />
          </div>

          <div className="relative w-full bg-logo-bg md:w-[70%]">
            <div
              className="absolute inset-0 bg-primary"
              style={{
                clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            />
            <div className="relative flex h-full w-full flex-wrap items-center justify-end gap-4 px-6 py-3 text-xs text-background sm:gap-6 sm:px-8 sm:text-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/10">
                  <i className="ri-phone-line text-base" aria-hidden />
                </span>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="text-background hover:underline"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/10">
                  <i className="ri-mail-line text-base" aria-hidden />
                </span>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-background hover:underline"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/10">
                  <i className="ri-time-line text-base" aria-hidden />
                </span>
                <span>{t("hours")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="border-b border-primary-light/10 bg-background">
        <div className="container-content flex w-full items-center justify-between gap-3 px-4 py-3 md:flex-wrap lg:px-8">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-foreground hover:bg-primary-light/30 focus:outline-none focus:ring-2 focus:ring-primary md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <i
              className={cn(
                "text-2xl",
                mobileMenuOpen ? "ri-close-line" : "ri-menu-line",
              )}
            />
          </button>

          <NavbarLogo className="md:hidden" imageClassName="h-8 max-w-[120px]" />

          <nav className="hidden flex-1 flex-wrap items-center gap-2 text-xs font-medium sm:text-sm md:flex">
            <NavLink href="/">{t("home")}</NavLink>
            <ServicesDropdown />
            <NavLink href="#">{t("industries")}</NavLink>
            <NavLink href="/ueber-uns">{t("aboutUs")}</NavLink>
            <NavLink href="#">{t("blogs")}</NavLink>
            <NavLink href="/kontakt">{t("contact")}</NavLink>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 md:ml-0">
            <LocaleDropdown />
            <DeliveryCtaButton label={t("bookExpressDelivery")} />
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-primary-dark/50 md:hidden"
            aria-hidden
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 h-full w-[280px] max-w-[85vw] overflow-y-auto bg-background shadow-xl md:hidden">
            <div className="flex flex-col gap-1 p-4 pt-16">
              <NavLink
                href="/"
                className="block rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("home")}
              </NavLink>
              <div className="border-t border-primary-light/20 pt-2">
                <ServicesDropdown onNavigate={() => setMobileMenuOpen(false)} />
              </div>
              <NavLink
                href="#"
                className="block rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("industries")}
              </NavLink>
              <NavLink
                href="/ueber-uns"
                className="block rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("aboutUs")}
              </NavLink>
              <NavLink
                href="#"
                className="block rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("blogs")}
              </NavLink>
              <NavLink
                href="/kontakt"
                className="block rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("contact")}
              </NavLink>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
