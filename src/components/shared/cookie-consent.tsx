"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Cookie } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

const STORAGE_KEY = "tb-cookie-consent";
const EASE = [0.22, 1, 0.36, 1] as const;

export function CookieConsent() {
  const t = useTranslations("cookies");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const persist = (value: "accepted" | "rejected") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage errors (e.g. private mode)
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-logo-bg/70 backdrop-blur-sm"
            aria-hidden
          />

          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="h-1.5 w-full bg-primary" aria-hidden />

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Cookie className="h-6 w-6" aria-hidden />
                </span>
                <h2
                  id="cookie-title"
                  className="text-xl font-extrabold tracking-tight text-logo-bg"
                >
                  {t("title")}
                </h2>
              </div>

              <p
                id="cookie-desc"
                className="mt-4 text-sm leading-relaxed text-foreground/70"
              >
                {t("description")}{" "}
                <Link
                  href="/datenschutz"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {t("learnMore")}
                </Link>
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => persist("accepted")}
                  className="order-1 inline-flex flex-1 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg sm:order-2"
                >
                  {t("accept")}
                </button>
                <button
                  type="button"
                  onClick={() => persist("rejected")}
                  className="order-2 inline-flex flex-1 items-center justify-center rounded-full border border-primary/30 bg-white px-6 py-3 text-sm font-bold text-logo-bg transition-all duration-200 hover:border-primary hover:bg-primary/5 sm:order-1"
                >
                  {t("reject")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
