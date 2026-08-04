import { formKeyLabel } from "@/lib/email-templates";
import type { Lead, LeadInput, LeadType } from "@/lib/leads/types";

const FORM_SOURCE_FALLBACK: Record<string, string> = {
  "contact-page-form": "/kontakt",
  "landing-contact-map-form": "/",
  "about-lead-form": "/ueber-uns",
  "industries-lead-form": "/branchen",
  "price-calculator-form": "/",
  landing_newsletter_form: "/",
  "service-lead-freight": "/spedition-lkw",
  "service-lead-refrigerated": "/kuehltransporte",
  "service-lead-courier": "/kuriertransporte",
  "service-lead-regularTours": "/feste-routen",
  "service-lead-international": "/internationaler-versand",
};

export function resolveSourcePage(formKey: string, sourcePage?: string) {
  const trimmed = sourcePage?.trim();
  if (trimmed) return trimmed;
  return FORM_SOURCE_FALLBACK[formKey] || "/";
}

export function resolveSourceLabel(formKey: string, sourcePage: string) {
  const label = formKeyLabel(formKey);
  return sourcePage ? `${label} · ${sourcePage}` : label;
}

export function resolveLeadType(formKey: string): LeadType {
  if (formKey === "price-calculator-form") return "price-calculator";
  if (
    formKey === "landing_newsletter_form" ||
    formKey.includes("newsletter")
  ) {
    return "newsletter";
  }
  return "contact";
}

export function normalizeLeadInput(
  input: LeadInput,
): Omit<Lead, "id" | "createdAt" | "updatedAt" | "status"> {
  const formKey = input.formKey.trim() || "contact_form";
  const sourcePage = resolveSourcePage(formKey, input.sourcePage);
  const type = input.type || resolveLeadType(formKey);

  return {
    type,
    formKey,
    sourcePage,
    sourceLabel: resolveSourceLabel(formKey, sourcePage),
    fullName: input.fullName?.trim() || "",
    email: input.email.trim(),
    phone: input.phone?.trim() || input.whatsapp?.trim() || "",
    whatsapp: input.whatsapp?.trim() || input.phone?.trim() || "",
    inquiryType: input.inquiryType?.trim() || "",
    message: input.message?.trim() || "",
    pickupAddress: input.pickupAddress?.trim() || "",
    deliveryAddress: input.deliveryAddress?.trim() || "",
    length: input.length?.trim() || "",
    width: input.width?.trim() || "",
    height: input.height?.trim() || "",
  };
}

export function displayLeadValue(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}
