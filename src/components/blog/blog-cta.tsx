"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

const EASE = [0.22, 1, 0.36, 1] as const;

export function BlogCta() {
  const t = useTranslations("blogPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-logo-bg py-16 md:py-20" aria-labelledby="blog-cta-heading">
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2
            id="blog-cta-heading"
            className="text-2xl font-extrabold text-white md:text-3xl lg:text-4xl"
          >
            {t("ctaTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
            {t("ctaSubtitle")}
          </p>
          <Link
            href="/kontakt"
            className="cta-delivery-btn mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold shadow-xl md:text-base"
          >
            {t("ctaButton")}
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
