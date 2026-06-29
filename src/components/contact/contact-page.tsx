"use client";

import { ContactCta } from "./contact-cta";
import { ContactForm } from "./contact-form";
import { ContactHero } from "./contact-hero";
import { ContactMap } from "./contact-map";
import { ContactMethods } from "./contact-methods";

export function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactMethods />
      <ContactForm />
      <ContactMap />
      <ContactCta />
    </>
  );
}
