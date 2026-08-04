"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { MathCaptchaModal } from "@/components/shared/math-captcha-modal";
import { useToast } from "@/components/shared/toast";

export function NewsletterSection() {
  const t = useTranslations("newsletterSection");
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaOpen, setCaptchaOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;
    setError(null);
    setCaptchaOpen(true);
  };

  const sendMail = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          sourcePage:
            typeof window !== "undefined" ? window.location.pathname : "/",
          website: "",
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || t("errorMessage"));
      }

      setCaptchaOpen(false);
      setSubmitted(true);
      setEmail("");
      showToast(t("toastSubmitted"));
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : t("errorMessage"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative z-10 px-4 pb-0 pt-4 sm:px-6 md:px-8"
      aria-labelledby="newsletter-heading"
    >
      <div className="container-content relative" style={{ marginBottom: "-80px" }}>
        <motion.div
          className="overflow-hidden rounded-3xl border border-logo-bg/8 bg-white shadow-[0_20px_60px_rgba(52,52,50,0.12)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-[1fr_auto]">
            <div className="flex flex-col justify-center px-8 py-10 md:py-12 md:pl-12 lg:pl-14">
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
                <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
                <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
                {t("tag")}
              </p>
              <h2
                id="newsletter-heading"
                className="text-2xl font-extrabold text-logo-bg sm:text-3xl"
              >
                {t("title")}
              </h2>
              <p className="mt-2 text-sm text-foreground/65 sm:text-base">
                {t("subtitle")}
              </p>
              {submitted ? (
                <p className="mt-6 font-medium text-primary-dark">
                  Thank you for subscribing.
                </p>
              ) : (
                <form
                  data-form-key="landing_newsletter_form"
                  data-analytics-no-auto-form-submit="true"
                  onSubmit={handleSubmit}
                  className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden
                    defaultValue=""
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    required
                    disabled={isSubmitting}
                    className="min-w-0 flex-1 rounded-xl border border-logo-bg/15 bg-logo-bg/5 px-4 py-3.5 text-logo-bg placeholder:text-logo-bg/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label={t("emailPlaceholder")}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cta-delivery-btn rounded-xl px-8 py-3.5 text-sm font-semibold shadow-md disabled:opacity-70"
                  >
                    {isSubmitting ? "..." : t("subscribe")}
                  </button>
                </form>
              )}
              {error ? (
                <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-foreground/55">{t("privacyNote")}</p>
            </div>

            <div className="hidden items-center justify-center bg-logo-bg px-10 md:flex">
              <span className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/20 text-primary">
                <Mail className="h-12 w-12" strokeWidth={1.5} aria-hidden />
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <MathCaptchaModal
        open={captchaOpen}
        onClose={() => {
          if (!isSubmitting) setCaptchaOpen(false);
        }}
        onVerified={sendMail}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}
