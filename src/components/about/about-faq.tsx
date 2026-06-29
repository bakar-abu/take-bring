"use client";

import { useTranslations } from "next-intl";
import { FaqSection } from "@/components/landing/faq/FaqSection";
import { ABOUT_FAQ_KEYS } from "@/config/about-page";

export function AboutFaq() {
  const t = useTranslations("aboutPage");

  const items = ABOUT_FAQ_KEYS.map((key) => ({
    question: t(`${key}Q`),
    answer: t(`${key}A`),
  }));

  return <FaqSection items={items} title={t("faqTitle")} />;
}
