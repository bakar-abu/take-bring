"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function PhoneCallWidget() {
  const t = useTranslations("floatingContact");
  const href = telHref(siteConfig.contact.phone);

  return (
    <motion.div
      className="fixed bottom-24 right-4 z-50 sm:bottom-28 sm:right-6"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={href}
        data-analytics-cta="floating-call"
        className="group flex flex-col items-center gap-3 no-underline"
        aria-label={t("callAria", { phone: siteConfig.contact.phone })}
      >
        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl sm:h-16 sm:w-16"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <Phone className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} aria-hidden />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.3, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
        </motion.div>
      </a>
    </motion.div>
  );
}
