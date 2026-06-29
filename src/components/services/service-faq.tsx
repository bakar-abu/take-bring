"use client";

import { useTranslations } from "next-intl";
import { FaqSection } from "@/components/landing/faq/FaqSection";
import type { ServiceConfig } from "@/config/services";

const FAQ_KEYS = ["faq1", "faq2", "faq3", "faq4"] as const;

export function ServiceFaq({ serviceId }: { serviceId: ServiceConfig["id"] }) {
  const t = useTranslations(`servicesPages.${serviceId}`);

  const items = FAQ_KEYS.map((key) => ({
    question: t(`${key}Q`),
    answer: t(`${key}A`),
  }));

  return <FaqSection items={items} title={t("faqTitle")} />;
}
