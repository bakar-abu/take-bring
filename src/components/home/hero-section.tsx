"use client";

import {
  HERO_BADGE_WIDTHS,
  HERO_HEIGHT,
  HERO_ROTATE_MS,
  HERO_SLIDES,
} from "@/config/hero";
import { DeliveryCtaButton } from "@/components/ui/delivery-cta-button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PriceCalculator } from "./price-calculator";

export function HeroSection() {
  const tHero = useTranslations("hero");
  const tSlide = useTranslations("slideshow");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsAnimating(true);
      setActiveIndex((index) => (index + 1) % HERO_SLIDES.length);
    }, HERO_ROTATE_MS);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [isAnimating, activeIndex]);

  const activeSlide = HERO_SLIDES[activeIndex];

  function goToSlide(index: number) {
    setIsAnimating(true);
    setActiveIndex(index);
  }

  return (
    <>
      <section
        className="relative w-full overflow-hidden bg-logo-bg"
        style={{ height: HERO_HEIGHT, minHeight: "320px" }}
      >
        <div
          key={activeSlide.id}
          className={cn(
            "absolute inset-0 bg-cover bg-center bg-no-repeat",
            isAnimating && "hero-slide-fade-in",
          )}
          style={{ backgroundImage: `url(${activeSlide.image})` }}
          aria-hidden
        />

        <div className="absolute inset-0 bg-logo-bg/50" aria-hidden />

        <div className="relative flex h-full w-full flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex flex-1 flex-col justify-center px-6 py-8 lg:px-10 xl:px-16">
            <div className="max-w-2xl">
              <div className="relative min-h-[4rem] sm:min-h-[5rem] lg:min-h-[5.5rem]">
                <h1
                  key={activeSlide.headlineKey}
                  className={cn(
                    "text-3xl font-bold leading-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl",
                    isAnimating && "hero-slide-fade-in",
                  )}
                >
                  {tHero(activeSlide.headlineKey)}
                </h1>
              </div>
              <DeliveryCtaButton
                label={tHero("getQuote")}
                className="cta-delivery-btn mt-6"
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end justify-center gap-2 py-6 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:flex-row lg:items-stretch lg:gap-0 lg:py-0">
            <div className="flex flex-col items-end gap-2">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "group flex items-center justify-end gap-3 border border-white/25 bg-logo-bg/60 py-3 pl-8 pr-5 shadow-lg backdrop-blur-md transition-colors hover:bg-white/10",
                    index === activeIndex &&
                      "border-b-2 border-l-2 border-r-8 border-t-2 border-primary border-r-primary",
                  )}
                  style={{
                    clipPath: "polygon(0px 0, 100% 0, 100% 100%, 30px 100%)",
                    width: HERO_BADGE_WIDTHS[index],
                  }}
                  aria-pressed={index === activeIndex}
                  aria-label={tSlide(slide.titleKey)}
                >
                  <span
                    className={cn(
                      "text-sm font-semibold uppercase tracking-wide transition-colors",
                      index === activeIndex
                        ? "text-white"
                        : "text-white/70 group-hover:text-white/90",
                    )}
                  >
                    {tSlide(slide.titleKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PriceCalculator />
    </>
  );
}
