/**
 * Landing page section order and status.
 *
 * Structure:
 * 1. Hero
 * 2. Services (main)
 * 3. Services-related (Shipping Details, Tracking)
 * 4. About company (About, Mission & Vision, Key Benefits, Warehouse, Industries)
 * 5. Rest (How It Works, Who Is It For, What Do You Get, Testimonials, Case Studies, Newsletter, FAQ, Contact/Map)
 */

export const LANDING_SECTION_ORDER = [
  "hero",
  "about",
  "services",
  "shippingDetails",
  "tracking",
  "missionVision",
  "keyBenefits",
  "warehouse",
  "industries",
  "howItWorks",
  "whoIsItFor",
  "whatYouGet",
  "testimonials",
  "caseStudies",
  "faq",
  "contactMap",
  "newsletter",
] as const;

export type LandingSectionId = (typeof LANDING_SECTION_ORDER)[number];

/** Human-readable labels for each section (for docs / debugging). */
export const LANDING_SECTION_LABELS: Record<LandingSectionId, string> = {
  hero: "Hero",
  services: "Services",
  shippingDetails: "Shipping Details",
  tracking: "Tracking",
  about: "About",
  missionVision: "Mission & Vision",
  keyBenefits: "Key Benefits",
  warehouse: "Warehouse",
  industries: "Industries",
  howItWorks: "How It Works",
  whoIsItFor: "Who Is It For",
  whatYouGet: "What Do You Get",
  testimonials: "Testimonials",
  caseStudies: "Case Studies",
  newsletter: "Newsletter",
  faq: "FAQ",
  contactMap: "Contact / Map",
};

/** Sections that are implemented and rendered. Missing sections are skipped. */
export const LANDING_SECTION_STATUS: Record<
  LandingSectionId,
  "done" | "not-built"
> = {
  hero: "done",
  services: "done",
  shippingDetails: "done",
  tracking: "done",
  about: "done",
  missionVision: "done",
  keyBenefits: "done",
  warehouse: "done",
  industries: "done",
  howItWorks: "done",
  whoIsItFor: "done",
  whatYouGet: "done",
  testimonials: "done",
  caseStudies: "done",
  newsletter: "done",
  faq: "done",
  contactMap: "done",
};
