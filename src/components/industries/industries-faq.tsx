"use client";

import { useTranslations } from "next-intl";
import { FaqSection } from "@/components/landing/faq/FaqSection";
import { FAQ_KEYS } from "@/config/industries-page";

export function IndustriesFaq() {
  const t = useTranslations("industriesPage");

  const items = FAQ_KEYS.map((key) => ({
    question: t(`${key}Q`),
    answer: t(`${key}A`),
  }));

  return <FaqSection items={items} title={t("faqTitle")} />;
}
