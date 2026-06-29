"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { ContactLeadForm } from "@/components/forms/contact-lead-form";
import type { ServiceConfig } from "@/config/services";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ServiceLeadForm({ config }: { config: ServiceConfig }) {
  const t = useTranslations(`servicesPages.${config.id}`);
  const tForm = useTranslations("serviceLeadForm");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="service-lead-form"
      className="scroll-mt-24 bg-white py-16 md:py-24"
      aria-labelledby="service-lead-form-heading"
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
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              {t("formTag")}
            </p>
            <h2
              id="service-lead-form-heading"
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
              formKey={`service-lead-${config.id}`}
              defaultInquiryType={config.inquiryType}
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
                  { value: "freight", label: tForm("inquiryFreight") },
                  { value: "refrigerated", label: tForm("inquiryRefrigerated") },
                  { value: "courier", label: tForm("inquiryCourier") },
                  { value: "regularTours", label: tForm("inquiryRegularTours") },
                  { value: "international", label: tForm("inquiryInternational") },
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
