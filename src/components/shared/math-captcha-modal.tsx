"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";

type MathChallenge = {
  question: string;
  answer: number;
};

function createChallenge(): MathChallenge {
  const ops = [
    () => {
      const a = 1 + Math.floor(Math.random() * 9);
      const b = 1 + Math.floor(Math.random() * 9);
      return { question: `${a} + ${b}`, answer: a + b };
    },
    () => {
      const a = 5 + Math.floor(Math.random() * 8);
      const b = 1 + Math.floor(Math.random() * Math.min(4, a - 1));
      return { question: `${a} − ${b}`, answer: a - b };
    },
    () => {
      const a = 2 + Math.floor(Math.random() * 5);
      const b = 2 + Math.floor(Math.random() * 4);
      return { question: `${a} × ${b}`, answer: a * b };
    },
  ] as const;

  return ops[Math.floor(Math.random() * ops.length)]();
}

type MathCaptchaModalProps = {
  open: boolean;
  onClose: () => void;
  onVerified: () => void | Promise<void>;
  isSubmitting?: boolean;
};

export function MathCaptchaModal({
  open,
  onClose,
  onVerified,
  isSubmitting = false,
}: MathCaptchaModalProps) {
  const t = useTranslations("common");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [challenge, setChallenge] = useState<MathChallenge>(() =>
    createChallenge(),
  );
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setChallenge(createChallenge());
    setValue("");
    setError(null);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const parsed = Number(value.trim());
    if (!Number.isFinite(parsed) || parsed !== challenge.answer) {
      setError(t("captchaIncorrect"));
      setChallenge(createChallenge());
      setValue("");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    await onVerified();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="math-captcha-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-logo-bg/70 backdrop-blur-sm"
            aria-label={t("captchaCloseVerification")}
            onClick={onClose}
            disabled={isSubmitting}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
          >
            <div className="h-1.5 w-full bg-primary" aria-hidden />
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2
                      id="math-captcha-title"
                      className="text-lg font-extrabold tracking-tight text-logo-bg"
                    >
                      {t("captchaTitle")}
                    </h2>
                    <p className="mt-1 text-sm text-foreground/65">
                      {t("captchaSubtitle")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-full p-1.5 text-logo-bg/50 transition hover:bg-logo-bg/5 hover:text-logo-bg"
                  aria-label={t("captchaClose")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleVerify} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor={inputId}
                    className="mb-2 block text-sm font-semibold text-logo-bg"
                  >
                    {t("captchaQuestion", { question: challenge.question })}
                  </label>
                  <input
                    ref={inputRef}
                    id={inputId}
                    type="number"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-logo-bg/15 bg-logo-bg/5 px-4 py-3 text-logo-bg outline-none ring-primary/30 focus:border-primary focus:ring-2"
                    placeholder={t("captchaAnswerPlaceholder")}
                  />
                </div>

                {error ? (
                  <p className="text-sm font-medium text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-logo-bg/20 px-5 py-3 text-sm font-bold text-logo-bg transition hover:bg-logo-bg/5"
                  >
                    {t("captchaCancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cta-delivery-btn inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-bold disabled:opacity-70"
                  >
                    {isSubmitting ? t("captchaSending") : t("captchaVerifySend")}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
