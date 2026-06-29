"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

const EASE = [0.22, 1, 0.36, 1] as const;
const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;

export function ContactCta() {
  const t = useTranslations("contactPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-logo-bg py-16 md:py-20" aria-labelledby="contact-cta-heading">
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2
            id="contact-cta-heading"
            className="text-2xl font-extrabold text-white md:text-3xl lg:text-4xl"
          >
            {t("ctaTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
            {t("ctaSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={phoneHref}
              className="cta-delivery-btn inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold shadow-xl md:text-base"
            >
              <Phone className="h-5 w-5" strokeWidth={2.5} aria-hidden />
              {t("ctaCall")}
            </a>
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-4 text-sm font-bold text-white transition-colors hover:border-primary hover:text-primary-light md:text-base"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2.5} aria-hidden />
              {t("ctaWhatsapp")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
