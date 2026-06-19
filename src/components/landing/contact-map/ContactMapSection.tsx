"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ContactLeadForm } from "@/components/forms/contact-lead-form";
import { siteConfig } from "@/config/site";

export function ContactMapSection() {
  const t = useTranslations("contactMapSection");
  const mapUrl = siteConfig.contact.mapEmbedUrl;

  return (
    <section
      className="relative w-full bg-white"
      aria-labelledby="contact-map-heading"
    >
      <div className="relative h-[700px] w-full overflow-hidden md:h-[600px] lg:h-[750px]">
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
          <div
            className="absolute inset-0 flex items-center justify-center bg-primary-light/10"
            aria-label={t("mapAriaLabel")}
          >
            <p className="px-4 text-center text-sm text-foreground/60">
              {t("mapPlaceholder")}
            </p>
          </div>
        )}

        <div className="absolute right-0 top-0 flex h-full w-full justify-end p-4 md:p-6 lg:w-1/2 lg:max-w-[480px] lg:pl-0">
          <div className="contact-form-glass contact-map-panel w-full max-w-[420px] overflow-hidden shadow-2xl">
            <div className="bg-white px-6 py-4 shadow-sm">
              <p className="mb-0.5 flex items-center gap-2 text-sm font-medium text-logo-bg/80">
                <span
                  className="h-2 w-2 shrink-0 rounded-sm bg-primary"
                  aria-hidden
                />
                {t("tag")}
              </p>
              <h2
                id="contact-map-heading"
                className="text-xl font-bold text-logo-bg sm:text-2xl"
              >
                {t("title")}
              </h2>
            </div>

            <div className="px-6 py-6">
              <ContactLeadForm
                formKey="landing-contact-map-form"
                labels={{
                  fullName: t("fullName"),
                  fullNamePlaceholder: t("fullNamePlaceholder"),
                  email: t("email"),
                  emailPlaceholder: t("emailPlaceholder"),
                  phone: t("contactNumber"),
                  phonePlaceholder: t("contactNumberPlaceholder"),
                  inquiryType: t("inquiryType"),
                  inquiryTypePlaceholder: t("inquiryTypePlaceholder"),
                  inquiryOptions: [
                    { value: "quote", label: t("inquiryQuote") },
                    { value: "tracking", label: t("inquiryTracking") },
                    { value: "general", label: t("inquiryGeneral") },
                    { value: "other", label: t("inquiryOther") },
                  ],
                  message: t("message"),
                  messagePlaceholder: t("messagePlaceholder"),
                  submitButton: t("submitButton"),
                  submitSending: t("submitSending"),
                  successMessage:
                    "Your query has been submitted. Our representative will contact you within 2 hours.",
                  errorMessage:
                    "We are having trouble sending your query. Please contact us via mail or WhatsApp.",
                }}
                style={{
                  formClassName: "space-y-4",
                  labelClassName: "mb-1 block text-sm font-medium text-white/90",
                  inputClassName: "input-glass w-full py-3 pl-4 pr-11",
                  selectClassName: "input-glass w-full py-3 pl-4 pr-11",
                  textareaClassName:
                    "input-glass w-full resize-none py-3 pl-4 pr-4",
                  buttonClassName:
                    "flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 font-semibold text-logo-bg shadow-lg transition-all hover:bg-primary-light hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-logo-bg/50 disabled:cursor-not-allowed disabled:opacity-70",
                  showIcons: true,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
