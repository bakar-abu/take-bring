"use client";

import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { ChevronDown, ChevronUp, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

type DefaultFaqItem = {
  qKey: string;
  aKey: string;
};

type CustomFaqItem = {
  question: string;
  answer: string;
};

type FaqItem = DefaultFaqItem | CustomFaqItem;

const DEFAULT_FAQ_ITEMS: DefaultFaqItem[] = [
  { qKey: "q1", aKey: "a1" },
  { qKey: "q2", aKey: "a2" },
  { qKey: "q3", aKey: "a3" },
  { qKey: "q4", aKey: "a4" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function FaqSection({
  items,
  title,
}: {
  items?: CustomFaqItem[];
  title?: string;
}) {
  const t = useTranslations("faqSection");
  const [openIndex, setOpenIndex] = useState<number>(0);
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const faqItems: FaqItem[] = items?.length ? items : DEFAULT_FAQ_ITEMS;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-logo-bg py-20 md:py-28"
      aria-labelledby="faq-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #abc629 0, #abc629 1px, transparent 0, transparent 50%)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="container-content relative grid gap-12 px-4 md:grid-cols-[1.4fr_380px] md:px-8 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span className="mb-4 inline-block rounded-md bg-primary px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-logo-bg">
            {t("tag")}
          </span>
          <h2
            id="faq-heading"
            className="mb-10 text-3xl font-extrabold leading-tight text-white md:text-4xl"
          >
            {title ?? t("title")}
          </h2>

          <div className="divide-y divide-white/10">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              const isCustom = "question" in item;
              return (
                <div
                  key={isCustom ? `custom-${index}` : item.qKey}
                  className={isOpen ? "bg-white/5" : undefined}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                    className="flex w-full items-start justify-between gap-4 py-6 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="flex items-start gap-3 text-base font-bold text-white md:text-lg">
                      <span className="mt-0.5 font-mono text-primary">
                        {String(index + 1).padStart(2, "0")}.
                      </span>
                      {isCustom ? item.question : t(item.qKey)}
                    </span>
                    {isOpen ? (
                      <ChevronUp
                        size={22}
                        className="shrink-0 text-primary"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <ChevronDown
                        size={22}
                        className="shrink-0 text-white/50"
                        strokeWidth={2.5}
                      />
                    )}
                  </button>
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 pl-10 pr-2">
                      <p className="text-sm leading-relaxed text-white/80 md:text-base">
                        <span className="font-bold text-white">
                          {t("answerLabel")}
                        </span>{" "}
                        {isCustom ? item.answer : t(item.aKey)}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          className="md:sticky md:top-24 md:self-start"
        >
          <div className="rounded-2xl bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] md:p-9">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary">
              {t("letsTalk")}
            </p>
            <h3 className="mb-8 text-2xl font-extrabold leading-snug text-logo-bg">
              {t("helpTitle")}
            </h3>
            <div className="mb-8 flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary shadow-md">
                <Phone size={28} className="text-logo-bg" strokeWidth={2.5} />
              </span>
              <div>
                <p className="mb-1 text-sm text-foreground/60">
                  {t("haveQuestions")}
                </p>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="text-xl font-extrabold text-logo-bg no-underline transition-colors hover:text-primary-dark"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>
            <Link
              href="/kontakt"
              className="cta-delivery-btn flex w-full items-center justify-center rounded-xl px-6 py-4 text-sm font-bold shadow-lg"
            >
              {t("contactUs")}
            </Link>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
