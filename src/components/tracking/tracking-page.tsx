"use client";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  Clock,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";
import { getMockTrackingResult } from "@/lib/tracking/mock-tracking";
import type { TrackingResult } from "@/lib/tracking/mock-tracking";
import { cn } from "@/lib/utils";

type TrackingPageViewProps = {
  initialTrackingId?: string;
};

export function TrackingPageView({
  initialTrackingId = "",
}: TrackingPageViewProps) {
  const t = useTranslations("trackingPage");
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [result, setResult] = useState<TrackingResult | null>(() =>
    initialTrackingId.trim()
      ? getMockTrackingResult(initialTrackingId)
      : null,
  );
  const [hasSearched, setHasSearched] = useState(Boolean(initialTrackingId.trim()));

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = trackingId.trim();
    if (!next) return;
    setHasSearched(true);
    setResult(getMockTrackingResult(next));
  }

  return (
    <div className="pb-16 pt-8 md:pb-24 md:pt-12">
      <div className="container-content space-y-10">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-dark">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-logo-bg md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-base text-foreground/60 md:text-lg">
            {t("subtitle")}
          </p>
        </header>

        <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>{t("demoBannerTitle")}</strong> {t("demoBannerText")}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{t("inputLabel")}</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
              aria-hidden
            />
            <input
              type="text"
              value={trackingId}
              onChange={(event) => setTrackingId(event.target.value)}
              placeholder={t("inputPlaceholder")}
              className="w-full rounded-xl border border-black/15 py-3.5 pl-11 pr-4 text-sm text-logo-bg outline-none placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-logo-bg px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {t("submit")}
          </button>
        </form>

        {hasSearched && result ? (
          <TrackingResultPanel result={result} />
        ) : null}

        <section className="mx-auto max-w-3xl">
          <h2 className="text-xl font-extrabold text-logo-bg">{t("faqTitle")}</h2>
          <ul className="mt-4 space-y-3">
            {[1, 2, 3].map((index) => (
              <li
                key={index}
                className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"
              >
                <p className="font-semibold text-logo-bg">
                  {t(`faq${index}Q` as "faq1Q")}
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  {t(`faq${index}A` as "faq1A")}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mx-auto max-w-2xl rounded-2xl border border-black/10 bg-logo-bg px-6 py-8 text-center text-white">
          <p className="text-lg font-bold">{t("ctaTitle")}</p>
          <p className="mt-2 text-sm text-white/70">{t("ctaText")}</p>
          <Link
            href="/kontakt"
            className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-logo-bg"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function TrackingResultPanel({ result }: { result: TrackingResult }) {
  const t = useTranslations("trackingPage");

  if (result.status === "not_found") {
    return (
      <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-900">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">{t("notFoundTitle")}</p>
          <p className="mt-1 text-sm">{t("notFoundText")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="grid gap-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:grid-cols-2 md:p-6">
        <InfoTile
          icon={Package}
          label={t("resultId")}
          value={result.trackingId}
        />
        <InfoTile
          icon={Truck}
          label={t("resultService")}
          value={result.service}
        />
        <InfoTile
          icon={MapPin}
          label={t("resultRoute")}
          value={`${result.origin} → ${result.destination}`}
        />
        <InfoTile icon={Clock} label={t("resultEta")} value={result.eta} />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-extrabold text-logo-bg">{t("timelineTitle")}</h2>
        <ol className="mt-6 space-y-0">
          {result.events.map((event, index) => (
            <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
              {index < result.events.length - 1 ? (
                <span
                  className="absolute left-[11px] top-6 h-[calc(100%-8px)] w-0.5 bg-black/10"
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-2",
                  event.status === "done"
                    ? "border-primary bg-primary"
                    : event.status === "current"
                      ? "border-primary bg-white ring-4 ring-primary/20"
                      : "border-black/15 bg-white",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-logo-bg">{event.label}</p>
                <p className="text-sm text-foreground/55">{event.location}</p>
                <p className="mt-1 text-xs text-foreground/45">{event.timestamp}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-black/[0.02] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground/45">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-logo-bg">{value}</p>
    </div>
  );
}
