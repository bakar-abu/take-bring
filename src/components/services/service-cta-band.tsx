"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ServiceConfig } from "@/config/services";

const EASE = [0.22, 1, 0.36, 1] as const;

function scrollToLeadForm() {
  document.getElementById("service-lead-form")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function ServiceCtaBand({ serviceId }: { serviceId: ServiceConfig["id"] }) {
  const t = useTranslations(`servicesPages.${serviceId}`);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-logo-bg py-16 md:py-20" aria-labelledby="service-cta-heading">
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2
            id="service-cta-heading"
            className="text-2xl font-extrabold text-white md:text-3xl lg:text-4xl"
          >
            {t("ctaTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
            {t("ctaSubtitle")}
          </p>
          <button
            type="button"
            onClick={scrollToLeadForm}
            className="cta-delivery-btn mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold shadow-xl md:text-base"
          >
            {t("ctaButton")}
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
