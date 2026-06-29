"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ContactLeadForm } from "@/components/forms/contact-lead-form";
import { SectionTag } from "./industries-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

export function IndustriesLeadForm() {
  const t = useTranslations("industriesPage");
  const tForm = useTranslations("serviceLeadForm");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="industries-lead-form"
      className="scroll-mt-24 bg-white py-16 md:py-24"
      aria-labelledby="industries-lead-form-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <div className="mb-8 text-center">
            <SectionTag>{t("formTag")}</SectionTag>
            <h2
              id="industries-lead-form-heading"
              className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
            >
              {t("formTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/65">
              {t("formSubtitle")}
            </p>
          </div>

          <div className="rounded-3xl border border-logo-bg/10 bg-[#f8f9f5] p-6 shadow-[0_12px_48px_rgba(52,52,50,0.08)] md:p-8">
            <ContactLeadForm
              formKey="industries-lead-form"
              defaultInquiryType="industries"
              hideInquiryType
              labels={{
                fullName: tForm("fullName"),
                fullNamePlaceholder: tForm("fullNamePlaceholder"),
                email: tForm("email"),
                emailPlaceholder: tForm("emailPlaceholder"),
                phone: tForm("phone"),
                phonePlaceholder: tForm("phonePlaceholder"),
                inquiryType: tForm("inquiryType"),
                inquiryTypePlaceholder: tForm("inquiryTypePlaceholder"),
                inquiryOptions: [
                  { value: "industries", label: tForm("inquiryIndustries") },
                  { value: "freight", label: tForm("inquiryFreight") },
                  { value: "general", label: tForm("inquiryGeneral") },
                ],
                message: tForm("message"),
                messagePlaceholder: t("formMessagePlaceholder"),
                submitButton: tForm("submitButton"),
                submitSending: tForm("submitSending"),
                successMessage: tForm("successMessage"),
                errorMessage: tForm("errorMessage"),
              }}
              style={{
                formClassName: "space-y-4",
                labelClassName: "mb-1 block text-sm font-semibold text-logo-bg",
                inputClassName:
                  "w-full rounded-xl border border-logo-bg/15 bg-white px-4 py-3 text-sm text-logo-bg outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
                textareaClassName:
                  "w-full resize-none rounded-xl border border-logo-bg/15 bg-white px-4 py-3 text-sm text-logo-bg outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
                buttonClassName:
                  "flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-logo-bg shadow-lg transition-all hover:bg-primary-light hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function IndustriesCtaBand() {
  const t = useTranslations("industriesPage");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  function scrollToForm() {
    document.getElementById("industries-lead-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="bg-logo-bg py-16 md:py-20" aria-labelledby="industries-cta-heading">
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2
            id="industries-cta-heading"
            className="text-2xl font-extrabold text-white md:text-3xl lg:text-4xl"
          >
            {t("ctaTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
            {t("ctaSubtitle")}
          </p>
          <button
            type="button"
            onClick={scrollToForm}
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
