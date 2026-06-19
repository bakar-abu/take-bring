import React, { type ReactNode } from "react";
import {
  LANDING_SECTION_ORDER,
  LANDING_SECTION_STATUS,
} from "@/config/landing-sections";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/landing/services/ServicesSection";
import { ShippingDetailsSection } from "@/components/landing/shippingdetails";
import { TrackingSection } from "@/components/landing/tracking";
import { AboutSection } from "@/components/landing/about/AboutSection";
import { KeyBenefitsSection } from "@/components/landing/keybenefits";
import { WarehouseSection } from "@/components/landing/warehouse";
import { IndustriesSection } from "@/components/landing/industries";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { WhoIsItForSection } from "@/components/landing/who-is-it-for";
import { WhatYouGetSection } from "@/components/landing/what-you-get";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { CaseStudiesSection } from "@/components/landing/case-studies";
import { NewsletterSection } from "@/components/landing/newsletter";
import { FaqSection } from "@/components/landing/faq/FaqSection";
import { ContactMapSection } from "@/components/landing/contact-map";

const SECTION_COMPONENTS: Partial<
  Record<(typeof LANDING_SECTION_ORDER)[number], ReactNode>
> = {
  hero: <HeroSection />,
  services: <ServicesSection />,
  about: <AboutSection />,
  shippingDetails: <ShippingDetailsSection />,
  tracking: <TrackingSection />,
  keyBenefits: <KeyBenefitsSection />,
  warehouse: <WarehouseSection />,
  industries: <IndustriesSection />,
  howItWorks: <HowItWorksSection />,
  whoIsItFor: <WhoIsItForSection />,
  whatYouGet: <WhatYouGetSection />,
  testimonials: <TestimonialsSection />,
  caseStudies: <CaseStudiesSection />,
  newsletter: <NewsletterSection />,
  faq: <FaqSection />,
  contactMap: <ContactMapSection />,
};

export function LandingPage() {
  return (
    <>
      {LANDING_SECTION_ORDER.map((sectionId) => {
        if (LANDING_SECTION_STATUS[sectionId] !== "done") return null;
        if (sectionId === "missionVision") return null;
        const node = SECTION_COMPONENTS[sectionId];
        return node != null ? (
          <React.Fragment key={sectionId}>{node}</React.Fragment>
        ) : null;
      })}
    </>
  );
}
