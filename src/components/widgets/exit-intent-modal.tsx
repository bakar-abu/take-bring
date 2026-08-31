"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Percent, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useExitIntent } from "@/hooks/use-exit-intent";
import {
  BUSINESS_PHONE,
  BUSINESS_WHATSAPP,
} from "@/config/chatbot-knowledge";

const PHONE_URL = `tel:${BUSINESS_PHONE}`;

export function ExitIntentModal() {
  const t = useTranslations("exitIntent");
  const { isOpen, dismiss } = useExitIntent();

  const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(
    t("whatsappPrefill"),
  )}`;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, dismiss]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-intent-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-logo-bg/75 backdrop-blur-sm"
            aria-label={t("dismiss")}
            onClick={dismiss}
          />

          <motion.div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="relative bg-gradient-to-br from-logo-bg via-logo-bg to-[#4a4a48] px-5 pb-5 pt-5 text-white">
              <button
                type="button"
                onClick={dismiss}
                className="absolute right-3 top-3 rounded-md p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label={t("dismiss")}
              >
                <X size={18} />
              </button>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-light">
                <Percent size={14} aria-hidden />
                {t("badge")}
              </div>

              <h2
                id="exit-intent-title"
                className="pr-8 text-xl font-bold leading-snug sm:text-2xl"
              >
                {t("title")}
              </h2>
              <p className="mt-2 text-sm text-white/85">{t("subtitle")}</p>

              <div className="mt-4 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-sm font-semibold text-primary-light">
                  {t("offerLabel")}
                </p>
                <p className="mt-1 text-lg font-bold">{t("offerValue")}</p>
                <p className="mt-1 text-xs text-white/75">{t("offerHint")}</p>
              </div>
            </div>

            <div className="space-y-3 px-5 py-5">
              <p className="text-sm font-semibold text-logo-bg">{t("helpTitle")}</p>
              <p className="text-sm text-foreground/70">{t("helpSubtitle")}</p>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <a
                  href={whatsappUrl}
                  data-analytics-cta="exit-intent-whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  <MessageCircle size={18} aria-hidden />
                  {t("whatsappCta")}
                </a>

                <a
                  href={PHONE_URL}
                  data-analytics-cta="exit-intent-call"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-logo-bg transition hover:brightness-95"
                >
                  <Phone size={18} aria-hidden />
                  {t("callCta")}
                </a>
              </div>

              <Link
                href="/kontakt"
                data-analytics-cta="exit-intent-quote"
                className="inline-flex w-full items-center justify-center rounded-lg bg-logo-bg px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-logo-bg/90"
                onClick={dismiss}
              >
                {t("quoteCta")}
              </Link>

              <button
                type="button"
                onClick={dismiss}
                className="w-full py-2 text-center text-sm text-foreground/60 transition hover:text-logo-bg"
              >
                {t("dismiss")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
