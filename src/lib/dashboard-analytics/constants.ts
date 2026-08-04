export type AnalyticsEventType = "page_view" | "cta_click" | "consent";

export type AnalyticsEventInput = {
  eventType: AnalyticsEventType;
  path?: string;
  locale?: string;
  referrer?: string;
  ctaId?: string;
  consentValue?: "accepted" | "rejected" | "";
  sessionId?: string;
  visitorId?: string;
  country?: string;
  device?: string;
  browser?: string;
  os?: string;
  meta?: Record<string, unknown>;
};

/** Default site locale (unprefixed `/` = Romanian). */
export const DEFAULT_ANALYTICS_LOCALE = "ro" as const;

export const SERVICE_ANALYTICS = [
  {
    id: "courier",
    label: "Courier",
    path: "/kuriertransporte",
    paths: ["/kuriertransporte", "/courier-transport", "/transport-curier"],
    formKeys: ["service-lead-courier"],
  },
  {
    id: "freight",
    label: "Freight",
    path: "/spedition-lkw",
    paths: ["/spedition-lkw", "/freight-forwarding", "/expeditie-camion"],
    formKeys: ["service-lead-freight"],
  },
  {
    id: "refrigerated",
    label: "Refrigerated",
    path: "/kuehltransporte",
    paths: [
      "/kuehltransporte",
      "/refrigerated-transport",
      "/transport-frigorific",
    ],
    formKeys: ["service-lead-refrigerated"],
  },
  {
    id: "regularTours",
    label: "Regular tours",
    path: "/feste-routen",
    paths: ["/feste-routen", "/regular-tours", "/tururi-regulate"],
    formKeys: ["service-lead-regularTours"],
  },
  {
    id: "international",
    label: "International",
    path: "/internationaler-versand",
    paths: [
      "/internationaler-versand",
      "/international-shipping",
      "/transport-international",
    ],
    formKeys: ["service-lead-international"],
  },
] as const;

export const CTA_LABELS: Record<string, string> = {
  "book-express": "Book Express",
  calculator: "Calculate price",
  call: "Call",
  whatsapp: "WhatsApp",
  track: "Track shipment",
  newsletter: "Newsletter",
  contact: "Contact form",
};

export const LOCALE_LABELS: Record<"ro" | "de" | "en", string> = {
  ro: "Romanian",
  de: "German",
  en: "English",
};

export const PAGE_LABELS: Record<string, string> = {
  "/": "Homepage",
  "/kontakt": "Contact",
  "/contact": "Contact",
  "/blog": "Blog",
  "/branchen": "Industries",
  "/industries": "Industries",
  "/industrii": "Industries",
  "/tracking": "Tracking",
  "/ueber-uns": "About",
  "/about-us": "About",
  "/despre-noi": "About",
  "/kuriertransporte": "Courier transport",
  "/courier-transport": "Courier transport",
  "/transport-curier": "Courier transport",
  "/spedition-lkw": "Freight forwarding",
  "/freight-forwarding": "Freight forwarding",
  "/expeditie-camion": "Freight forwarding",
  "/kuehltransporte": "Refrigerated transport",
  "/refrigerated-transport": "Refrigerated transport",
  "/transport-frigorific": "Refrigerated transport",
  "/feste-routen": "Fixed routes",
  "/regular-tours": "Fixed routes",
  "/tururi-regulate": "Fixed routes",
  "/internationaler-versand": "International shipping",
  "/international-shipping": "International shipping",
  "/transport-international": "International shipping",
};

/** Map any localized service URL → service id */
export function serviceIdForPath(path: string): string | null {
  const normalized = path.split("?")[0]?.split("#")[0] || path;
  for (const service of SERVICE_ANALYTICS) {
    if ((service.paths as readonly string[]).includes(normalized)) {
      return service.id;
    }
  }
  return null;
}
