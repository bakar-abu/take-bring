"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Truck,
  Snowflake,
  Package,
  Route,
  Ship,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import type { AppPathname } from "@/config/navigation";
import { WhatWeOfferSection } from "@/components/landing/services/what-we-offer-section";
import { ExpressServicesSection } from "@/components/landing/services/express-services-section";

const SERVICES = [
  {
    id: "freight",
    titleKey: "freightTitle" as const,
    Icon: Truck,
    image: "/images/service-freight.webp",
    href: "/spedition-lkw" as AppPathname,
  },
  {
    id: "refrigerated",
    titleKey: "refrigeratedTitle" as const,
    Icon: Snowflake,
    image: "/images/service-refrigerated.webp",
    href: "/kuehltransporte" as AppPathname,
  },
  {
    id: "courier",
    titleKey: "courierTitle" as const,
    Icon: Package,
    image: "/images/service-courier.webp",
    href: "/kuriertransporte" as AppPathname,
  },
  {
    id: "regularTours",
    titleKey: "regularToursTitle" as const,
    Icon: Route,
    image: "/images/service-regular-tours-hero.webp",
    href: "/feste-routen" as AppPathname,
  },
  {
    id: "international",
    titleKey: "internationalTitle" as const,
    Icon: Ship,
    image: "/images/service-international-hero.webp",
    href: "/internationaler-versand" as AppPathname,
  },
] as const;

const VISIBLE = 3;

function CarouselButton({
  dir,
  onClick,
  disabled,
  ariaLabel,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-logo-bg/10 bg-logo-bg text-white shadow-[0_4px_14px_rgba(52,52,50,0.2)] transition-all hover:scale-105 hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-logo-bg/20 disabled:shadow-none"
    >
      <Icon className="h-5 w-5" strokeWidth={2.2} />
    </button>
  );
}

function LogisticsServiceCard({
  image,
  icon: Icon,
  category,
  title,
  href,
  readMore,
}: {
  image: string;
  icon: React.ElementType;
  category: string;
  title: string;
  href: AppPathname;
  readMore: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-logo-bg/8 bg-white shadow-[0_8px_40px_rgba(52,52,50,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_24px_56px_rgba(52,52,50,0.14)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 900px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-logo-bg/70 via-logo-bg/10 to-transparent" />
        <span className="absolute left-5 top-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 text-primary shadow-md">
          <Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
          {category}
        </span>
        <h3 className="mt-2 text-xl font-extrabold leading-snug text-logo-bg">
          {title}
        </h3>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-logo-bg transition-colors group-hover:text-primary">
          {readMore}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}

export function ServicesSection() {
  const t = useTranslations("servicesSection");
  const tSlide = useTranslations("slideshow");

  const [startIndex, setStartIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);

  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE < SERVICES.length;

  function slide(dir: "left" | "right") {
    if (animating) return;
    setSlideDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setStartIndex((i) => (dir === "right" ? i + 1 : i - 1));
      setAnimating(false);
      setSlideDir(null);
    }, 300);
  }

  const visible = SERVICES.slice(startIndex, startIndex + VISIBLE);
  const trackClass = [
    "grid gap-6 transition-all duration-300 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8",
    animating && slideDir === "right" ? "translate-x-2 opacity-0" : "",
    animating && slideDir === "left" ? "-translate-x-2 opacity-0" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <section
        className="bg-[#f4f7f6] py-20 md:py-24"
        aria-labelledby="popular-logistics-heading"
      >
        <div className="container-content px-4 md:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
                <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
                <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
                {t("typesOfLogistics")}
              </p>
              <h2
                id="popular-logistics-heading"
                className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
              >
                {t("popularLogisticsServices")}
              </h2>
            </div>
            <div className="flex gap-3">
              <CarouselButton
                dir="left"
                onClick={() => slide("left")}
                disabled={!canPrev}
                ariaLabel={t("prevButton")}
              />
              <CarouselButton
                dir="right"
                onClick={() => slide("right")}
                disabled={!canNext}
                ariaLabel={t("nextButton")}
              />
            </div>
          </div>

          <div
            className={trackClass}
            role="list"
            aria-live="polite"
            aria-label={t("popularLogisticsServices")}
          >
            {visible.map((service) => (
              <div key={service.id + "-" + startIndex} role="listitem">
                <LogisticsServiceCard
                  image={service.image}
                  icon={service.Icon}
                  category={t("tracking")}
                  title={tSlide(service.titleKey)}
                  href={service.href}
                  readMore={t("readMore")}
                />
              </div>
            ))}
          </div>

          {SERVICES.length > VISIBLE && (
            <div
              className="mt-10 flex justify-center gap-2"
              role="tablist"
              aria-label={t("typesOfLogistics")}
            >
              {Array.from({
                length: Math.max(1, SERVICES.length - VISIBLE + 1),
              }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === startIndex}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === startIndex
                      ? "w-7 bg-primary"
                      : "w-2 bg-logo-bg/20 hover:bg-logo-bg/40"
                  }`}
                  onClick={() =>
                    setStartIndex(
                      Math.min(i, Math.max(0, SERVICES.length - VISIBLE)),
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ExpressServicesSection />
      <WhatWeOfferSection />
    </>
  );
}
