"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { SectionTag } from "./contact-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactMap() {
  const t = useTranslations("contactPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mapUrl = siteConfig.contact.mapEmbedUrl;

  return (
    <section
      id="contact-map"
      className="scroll-mt-24 bg-white py-16 md:py-24"
      aria-labelledby="contact-map-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <SectionTag>{t("mapTag")}</SectionTag>
          <h2
            id="contact-map-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("mapTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("mapSubtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-logo-bg/10 shadow-2xl md:h-[520px]"
        >
          {mapUrl ? (
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t("mapAriaLabel")}
              aria-label={t("mapAriaLabel")}
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary-light/10">
              <p className="px-4 text-center text-sm text-foreground/60">
                {t("mapPlaceholder")}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
