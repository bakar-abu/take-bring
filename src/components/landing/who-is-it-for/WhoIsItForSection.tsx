"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

const AUDIENCES = [
  { key: "audience1", image: "/images/audience-business.webp" },
  { key: "audience2", image: "/images/audience-ecommerce.webp" },
  { key: "audience3", image: "/images/audience-individual.webp" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function WhoIsItForSection() {
  const t = useTranslations("whoIsItForSection");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      className="bg-[#f4f7f6] py-20 md:py-24"
      aria-labelledby="who-is-it-for-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("tag")}
          </p>
          <h2
            id="who-is-it-for-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {AUDIENCES.map(({ key, image }, index) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
              className="group relative overflow-hidden rounded-3xl border border-logo-bg/8 bg-white p-8 shadow-[0_8px_40px_rgba(52,52,50,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_24px_56px_rgba(52,52,50,0.12)]"
            >
              <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
              <div className="relative mx-auto mb-6 h-24 w-24 overflow-hidden rounded-2xl ring-1 ring-logo-bg/10 transition-all group-hover:ring-primary/30">
                <Image
                  src={image}
                  alt={t(`${key}Title`)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="96px"
                />
              </div>
              <h3 className="text-center text-xl font-extrabold text-logo-bg">
                {t(`${key}Title`)}
              </h3>
              <p className="mt-3 text-center text-sm leading-relaxed text-foreground/65 md:text-base">
                {t(`${key}Description`)}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <Link
            href="/kontakt"
            className="cta-delivery-btn inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold shadow-md"
            aria-label={t("bookOrder")}
          >
            {t("bookOrder")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
