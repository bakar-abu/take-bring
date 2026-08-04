import type {
  AnalyticsPeriod,
  WebsiteAnalyticsSnapshot,
} from "@/lib/dashboard-analytics/types";

/**
 * MOCK DATA — for UI visibility only.
 * TODO(integrate): Replace with GA4 / Clarity / first-party event pipeline.
 * Lead-source rows can already be partially fed from listLeads().
 */
const SNAPSHOT_7D: WebsiteAnalyticsSnapshot = {
  period: "7d",
  kpis: {
    visitors: 1842,
    leads: 47,
    conversionRate: 2.55,
    consentRate: 68,
    visitorsChangePct: 12.4,
    leadsChangePct: 8.1,
  },
  locales: [
    { locale: "ro", label: "Romanian", visitors: 812, leads: 19, sharePct: 44 },
    { locale: "de", label: "German", visitors: 698, leads: 21, sharePct: 38 },
    { locale: "en", label: "English", visitors: 332, leads: 7, sharePct: 18 },
  ],
  countries: [
    { key: "RO", label: "Romania", visitors: 740, sharePct: 40 },
    { key: "DE", label: "Germany", visitors: 620, sharePct: 34 },
    { key: "AT", label: "Austria", visitors: 180, sharePct: 10 },
    { key: "NL", label: "Netherlands", visitors: 120, sharePct: 7 },
    { key: "unknown", label: "Unknown", visitors: 182, sharePct: 9 },
  ],
  devices: [
    { key: "Desktop", label: "Desktop", visitors: 980, sharePct: 53 },
    { key: "Mobile", label: "Mobile", visitors: 720, sharePct: 39 },
    { key: "Tablet", label: "Tablet", visitors: 142, sharePct: 8 },
  ],
  browsers: [
    { key: "Chrome", label: "Chrome", visitors: 980, sharePct: 53 },
    { key: "Safari", label: "Safari", visitors: 410, sharePct: 22 },
    { key: "Firefox", label: "Firefox", visitors: 220, sharePct: 12 },
    { key: "Edge", label: "Edge", visitors: 232, sharePct: 13 },
  ],
  leadSources: [
    {
      formKey: "price-calculator-form",
      label: "Homepage price calculator",
      leads: 14,
      sharePct: 30,
    },
    {
      formKey: "contact-page-form",
      label: "Contact page",
      leads: 11,
      sharePct: 23,
    },
    {
      formKey: "service-lead-courier",
      label: "Service page (courier)",
      leads: 7,
      sharePct: 15,
    },
    {
      formKey: "landing-contact-map-form",
      label: "Homepage contact form",
      leads: 6,
      sharePct: 13,
    },
    {
      formKey: "service-lead-freight",
      label: "Service page (freight)",
      leads: 4,
      sharePct: 9,
    },
    {
      formKey: "industries-lead-form",
      label: "Industries page",
      leads: 3,
      sharePct: 6,
    },
    {
      formKey: "landing_newsletter_form",
      label: "Newsletter",
      leads: 2,
      sharePct: 4,
    },
  ],
  services: [
    {
      id: "courier",
      label: "Courier",
      path: "/kuriertransporte",
      views: 412,
      leads: 7,
    },
    {
      id: "freight",
      label: "Freight",
      path: "/spedition-lkw",
      views: 298,
      leads: 4,
    },
    {
      id: "refrigerated",
      label: "Refrigerated",
      path: "/kuehltransporte",
      views: 186,
      leads: 2,
    },
    {
      id: "regularTours",
      label: "Regular tours",
      path: "/feste-routen",
      views: 154,
      leads: 1,
    },
    {
      id: "international",
      label: "International",
      path: "/internationaler-versand",
      views: 221,
      leads: 3,
    },
  ],
  ctas: [
    { id: "book-express", label: "Book Express", clicks: 186, conversions: 22 },
    { id: "calculator", label: "Calculate price", clicks: 94, conversions: 14 },
    { id: "call", label: "Call", clicks: 71, conversions: 0 },
    { id: "whatsapp", label: "WhatsApp", clicks: 58, conversions: 0 },
    { id: "track", label: "Track shipment", clicks: 43, conversions: 0 },
  ],
  topPages: [
    { path: "/", label: "Homepage", views: 980, engagementRate: 54 },
    {
      path: "/kuriertransporte",
      label: "Courier transport",
      views: 412,
      engagementRate: 61,
    },
    { path: "/kontakt", label: "Contact", views: 305, engagementRate: 72 },
    {
      path: "/spedition-lkw",
      label: "Freight forwarding",
      views: 298,
      engagementRate: 58,
    },
    { path: "/blog", label: "Blog", views: 210, engagementRate: 49 },
    { path: "/tracking", label: "Tracking", views: 168, engagementRate: 41 },
  ],
  blogs: [
    {
      slug: "same-day-courier-business",
      title: "Same-day courier for business",
      views: 142,
      ctaClicks: 18,
    },
    {
      slug: "cold-chain-best-practices",
      title: "Cold-chain best practices",
      views: 98,
      ctaClicks: 11,
    },
    {
      slug: "europe-freight-forwarding-guide",
      title: "Europe freight forwarding guide",
      views: 87,
      ctaClicks: 9,
    },
  ],
};

const SNAPSHOT_30D: WebsiteAnalyticsSnapshot = {
  period: "30d",
  kpis: {
    visitors: 7240,
    leads: 168,
    conversionRate: 2.32,
    consentRate: 71,
    visitorsChangePct: 6.8,
    leadsChangePct: 14.2,
  },
  locales: [
    { locale: "ro", label: "Romanian", visitors: 3102, leads: 62, sharePct: 43 },
    { locale: "de", label: "German", visitors: 2896, leads: 78, sharePct: 40 },
    { locale: "en", label: "English", visitors: 1242, leads: 28, sharePct: 17 },
  ],
  countries: [
    { key: "RO", label: "Romania", visitors: 2900, sharePct: 40 },
    { key: "DE", label: "Germany", visitors: 2520, sharePct: 35 },
    { key: "AT", label: "Austria", visitors: 620, sharePct: 9 },
    { key: "NL", label: "Netherlands", visitors: 410, sharePct: 6 },
    { key: "FR", label: "France", visitors: 280, sharePct: 4 },
    { key: "unknown", label: "Unknown", visitors: 510, sharePct: 6 },
  ],
  devices: [
    { key: "Desktop", label: "Desktop", visitors: 3920, sharePct: 54 },
    { key: "Mobile", label: "Mobile", visitors: 2780, sharePct: 38 },
    { key: "Tablet", label: "Tablet", visitors: 540, sharePct: 8 },
  ],
  browsers: [
    { key: "Chrome", label: "Chrome", visitors: 3880, sharePct: 54 },
    { key: "Safari", label: "Safari", visitors: 1520, sharePct: 21 },
    { key: "Firefox", label: "Firefox", visitors: 840, sharePct: 12 },
    { key: "Edge", label: "Edge", visitors: 720, sharePct: 10 },
    { key: "Other", label: "Other", visitors: 280, sharePct: 3 },
  ],
  leadSources: [
    {
      formKey: "price-calculator-form",
      label: "Homepage price calculator",
      leads: 48,
      sharePct: 29,
    },
    {
      formKey: "contact-page-form",
      label: "Contact page",
      leads: 41,
      sharePct: 24,
    },
    {
      formKey: "service-lead-courier",
      label: "Service page (courier)",
      leads: 22,
      sharePct: 13,
    },
    {
      formKey: "landing-contact-map-form",
      label: "Homepage contact form",
      leads: 19,
      sharePct: 11,
    },
    {
      formKey: "service-lead-freight",
      label: "Service page (freight)",
      leads: 15,
      sharePct: 9,
    },
    {
      formKey: "service-lead-international",
      label: "Service page (international)",
      leads: 9,
      sharePct: 5,
    },
    {
      formKey: "industries-lead-form",
      label: "Industries page",
      leads: 8,
      sharePct: 5,
    },
    {
      formKey: "landing_newsletter_form",
      label: "Newsletter",
      leads: 6,
      sharePct: 4,
    },
  ],
  services: [
    {
      id: "courier",
      label: "Courier",
      path: "/kuriertransporte",
      views: 1680,
      leads: 22,
    },
    {
      id: "freight",
      label: "Freight",
      path: "/spedition-lkw",
      views: 1210,
      leads: 15,
    },
    {
      id: "refrigerated",
      label: "Refrigerated",
      path: "/kuehltransporte",
      views: 740,
      leads: 8,
    },
    {
      id: "regularTours",
      label: "Regular tours",
      path: "/feste-routen",
      views: 620,
      leads: 5,
    },
    {
      id: "international",
      label: "International",
      path: "/internationaler-versand",
      views: 890,
      leads: 9,
    },
  ],
  ctas: [
    { id: "book-express", label: "Book Express", clicks: 712, conversions: 78 },
    { id: "calculator", label: "Calculate price", clicks: 356, conversions: 48 },
    { id: "call", label: "Call", clicks: 268, conversions: 0 },
    { id: "whatsapp", label: "WhatsApp", clicks: 214, conversions: 0 },
    { id: "track", label: "Track shipment", clicks: 176, conversions: 0 },
  ],
  topPages: [
    { path: "/", label: "Homepage", views: 3840, engagementRate: 52 },
    {
      path: "/kuriertransporte",
      label: "Courier transport",
      views: 1680,
      engagementRate: 59,
    },
    { path: "/kontakt", label: "Contact", views: 1180, engagementRate: 70 },
    {
      path: "/spedition-lkw",
      label: "Freight forwarding",
      views: 1210,
      engagementRate: 56,
    },
    { path: "/blog", label: "Blog", views: 840, engagementRate: 47 },
    { path: "/branchen", label: "Industries", views: 620, engagementRate: 51 },
    { path: "/tracking", label: "Tracking", views: 590, engagementRate: 38 },
  ],
  blogs: [
    {
      slug: "same-day-courier-business",
      title: "Same-day courier for business",
      views: 520,
      ctaClicks: 64,
    },
    {
      slug: "cold-chain-best-practices",
      title: "Cold-chain best practices",
      views: 410,
      ctaClicks: 39,
    },
    {
      slug: "europe-freight-forwarding-guide",
      title: "Europe freight forwarding guide",
      views: 360,
      ctaClicks: 31,
    },
    {
      slug: "international-shipping-customs",
      title: "International shipping & customs",
      views: 290,
      ctaClicks: 22,
    },
  ],
};

export function getMockAnalyticsSnapshot(
  period: AnalyticsPeriod,
): WebsiteAnalyticsSnapshot {
  return period === "7d" ? SNAPSHOT_7D : SNAPSHOT_30D;
}
