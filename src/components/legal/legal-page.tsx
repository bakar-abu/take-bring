"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

const EASE = [0.22, 1, 0.36, 1] as const;

type LegalSection = {
  heading: string;
  body: string[];
};

export function LegalPage({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const sections = t.raw("sections") as LegalSection[];

  return (
    <>
      <section
        className="relative overflow-hidden bg-logo-bg py-20 md:py-24"
        aria-labelledby="legal-hero-title"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #abc629 0, #abc629 1px, transparent 0, transparent 50%)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(171,198,41,0.14),transparent_60%)]" />
        <div className="container-content relative px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-light">
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              {t("tag")}
            </p>
            <h1
              id="legal-hero-title"
              className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              {t("title")}
            </h1>
            <p className="mt-4 text-sm font-medium text-white/60">
              {t("lastUpdatedLabel")} {t("lastUpdated")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-content px-4 md:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="mx-auto max-w-3xl"
          >
            <p className="text-base leading-relaxed text-foreground/75 md:text-lg">
              {t("intro")}
            </p>

            {sections.map((section, index) => (
              <section key={index} className="mt-10">
                <h2 className="text-xl font-extrabold tracking-tight text-logo-bg md:text-2xl">
                  {section.heading}
                </h2>
                {section.body.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="mt-3 text-base leading-relaxed text-foreground/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
