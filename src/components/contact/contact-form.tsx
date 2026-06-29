"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Clock, Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { ContactLeadForm } from "@/components/forms/contact-lead-form";
import { siteConfig } from "@/config/site";
import { SectionTag } from "./contact-hero";

const EASE = [0.22, 1, 0.36, 1] as const;
const HIGHLIGHTS = ["formHighlight1", "formHighlight2", "formHighlight3"] as const;
const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;
const mailHref = `mailto:${siteConfig.contact.email}`;

export function ContactForm() {
  const t = useTranslations("contactPage");
  const tForm = useTranslations("serviceLeadForm");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="contact-form"
      className="scroll-mt-24 bg-[#f4f7f6] py-16 md:py-24"
      aria-labelledby="contact-form-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
        >
          <div className="lg:pt-4">
            <SectionTag>{t("formTag")}</SectionTag>
            <h2
              id="contact-form-heading"
              className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
            >
              {t("formTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/65">
              {t("formSubtitle")}
            </p>

            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-logo-bg md:text-base">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-4">
              <a
                href={phoneHref}
                className="flex items-center gap-4 rounded-2xl border border-logo-bg/10 bg-white px-5 py-4 transition-colors hover:border-primary/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Phone className="h-5 w-5" strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    {t("phoneTitle")}
                  </span>
                  <span className="block text-base font-bold text-logo-bg">
                    {siteConfig.contact.phone}
                  </span>
                </span>
              </a>
              <a
                href={mailHref}
                className="flex items-center gap-4 rounded-2xl border border-logo-bg/10 bg-white px-5 py-4 transition-colors hover:border-primary/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Mail className="h-5 w-5" strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    {t("emailTitle")}
                  </span>
                  <span className="block text-base font-bold text-logo-bg">
                    {siteConfig.contact.email}
                  </span>
                </span>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-logo-bg/10 bg-white px-5 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Clock className="h-5 w-5" strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    {t("hoursLabel")}
                  </span>
                  <span className="block text-base font-bold text-logo-bg">
                    {t("hoursValue")}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-logo-bg/10 bg-white p-6 shadow-[0_12px_48px_rgba(52,52,50,0.1)] md:p-8">
            <ContactLeadForm
              formKey="contact-page-form"
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
                  { value: "general", label: tForm("inquiryGeneral") },
                  { value: "freight", label: tForm("inquiryFreight") },
                  { value: "refrigerated", label: tForm("inquiryRefrigerated") },
                  { value: "courier", label: tForm("inquiryCourier") },
                  { value: "regularTours", label: tForm("inquiryRegularTours") },
                  { value: "international", label: tForm("inquiryInternational") },
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
                  "w-full rounded-xl border border-logo-bg/15 bg-[#f8f9f5] px-4 py-3 text-sm text-logo-bg outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
                selectClassName:
                  "w-full rounded-xl border border-logo-bg/15 bg-[#f8f9f5] px-4 py-3 text-sm text-logo-bg outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
                textareaClassName:
                  "w-full resize-none rounded-xl border border-logo-bg/15 bg-[#f8f9f5] px-4 py-3 text-sm text-logo-bg outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
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
