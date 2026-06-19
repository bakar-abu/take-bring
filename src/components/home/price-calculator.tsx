"use client";

import { DeliveryCtaButton } from "@/components/ui/delivery-cta-button";
import { CALCULATOR_STATS } from "@/config/hero";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const inputClassName =
  "w-full rounded-lg border border-primary-light/40 bg-white py-2.5 pl-4 pr-4 text-foreground placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

export function PriceCalculator() {
  const t = useTranslations("hero");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [pickUp, setPickUp] = useState("");
  const [delivery, setDelivery] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [revealText, setRevealText] = useState(false);

  useEffect(() => {
    if (isCalculating) {
      const timer = setTimeout(() => setRevealText(true), 50);
      return () => clearTimeout(timer);
    }
    setRevealText(false);
  }, [isCalculating]);

  const showResultArea = isCalculating || requestSent;

  async function handleCalculate(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !number.trim() || !pickUp.trim() || !delivery.trim()) {
      return;
    }

    setIsCalculating(true);
    setRequestSent(false);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsCalculating(false);
    setRequestSent(true);
  }

  return (
    <section className="bg-[#f4f7f6]">
      <div className="relative z-10 mx-auto -mt-20 w-full max-w-5xl rounded-3xl border-2 border-primary-light/30 bg-white px-4 pb-8 pt-6 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:px-6 md:px-8 lg:px-10">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground underline decoration-primary-light/40 underline-offset-10">
          {t("calculatorHeading")}
        </h2>

        <form onSubmit={handleCalculate} className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="hero-name" className="mb-1 block text-sm font-medium text-foreground">
                {t("nameLabel")} *
              </label>
              <input
                id="hero-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                required
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="hero-email" className="mb-1 block text-sm font-medium text-foreground">
                {t("emailLabel")} *
              </label>
              <input
                id="hero-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className={inputClassName}
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="hero-number" className="mb-1 block text-sm font-medium text-foreground">
              {t("numberLabel")} *
            </label>
            <input
              id="hero-number"
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={t("numberPlaceholder")}
              required
              className={inputClassName}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="hero-pickup" className="mb-1 block text-sm font-medium text-foreground">
                {t("pickUpLocation")} *
              </label>
              <div className="relative">
                <input
                  id="hero-pickup"
                  type="text"
                  value={pickUp}
                  onChange={(e) => setPickUp(e.target.value)}
                  placeholder={t("pickUpLocation")}
                  required
                  className={cn(inputClassName, "pr-10")}
                />
                <i
                  className="ri-map-pin-line pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                  aria-hidden
                />
              </div>
            </div>
            <div>
              <label htmlFor="hero-delivery" className="mb-1 block text-sm font-medium text-foreground">
                {t("deliveryLocationLabel")} *
              </label>
              <div className="relative">
                <input
                  id="hero-delivery"
                  type="text"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  placeholder={t("deliveryLocationLabel")}
                  required
                  className={cn(inputClassName, "pr-10")}
                />
                <i
                  className="ri-map-pin-line pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <p className="mb-0 w-full text-sm font-medium text-foreground sm:w-auto">
              {t("dimensionsLabel")}
            </p>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {[
                { value: length, set: setLength, label: t("lengthLabel") },
                { value: width, set: setWidth, label: t("widthLabel") },
                { value: height, set: setHeight, label: t("heightLabel") },
              ].map((field) => (
                <div key={field.label} className="relative min-w-[80px] flex-1">
                  <input
                    placeholder={field.label}
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    className={cn(inputClassName, "pl-3 pr-9")}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                    cm
                  </span>
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="cta-delivery-btn inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
            >
              <i className="ri-truck-line text-lg" aria-hidden />
              {t("calculatePriceBtn")}
            </button>
          </div>

          {showResultArea ? (
            <div className="relative mt-4 flex min-h-[5rem] w-full items-center justify-center overflow-hidden rounded-2xl bg-primary px-4 py-5">
              {isCalculating ? (
                <div
                  className={cn(
                    "flex w-full items-center justify-center gap-4 text-lg font-semibold text-white transition-opacity duration-500",
                    revealText ? "opacity-100" : "opacity-0",
                  )}
                >
                  <i className="ri-truck-line animate-pulse text-5xl" aria-hidden />
                  <span>{t("sendingRequest")}</span>
                </div>
              ) : requestSent ? (
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <i className="ri-checkbox-circle-line text-5xl text-white" aria-hidden />
                  <p className="text-lg font-semibold text-white">{t("requestSentMessage")}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </form>

        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-primary-light/30 pt-6">
          {CALCULATOR_STATS.map((key) => (
            <div key={key} className="flex items-center gap-2 text-sm text-foreground">
              <i className="ri-checkbox-circle-line shrink-0 text-lg text-primary" aria-hidden />
              <span>{t(key)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
