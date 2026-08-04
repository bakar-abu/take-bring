"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

export function WhatsAppWidget() {
  const t = useTranslations("floatingContact");
  const href = siteConfig.social.whatsapp;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={href}
        data-analytics-cta="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center gap-3 no-underline"
        aria-label={t("whatsappAria")}
      >
        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl sm:h-16 sm:w-16"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <i
            className="ri-whatsapp-fill text-[1.85rem] leading-none sm:text-[2.1rem]"
            aria-hidden
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#25D366]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
        </motion.div>
      </a>
    </motion.div>
  );
}
