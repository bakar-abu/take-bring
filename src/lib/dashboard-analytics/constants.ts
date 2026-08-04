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
  meta?: Record<string, unknown>;
};

export const SERVICE_ANALYTICS = [
  {
    id: "courier",
    label: "Courier",
    path: "/kuriertransporte",
    formKeys: ["service-lead-courier"],
  },
  {
    id: "freight",
    label: "Freight",
    path: "/spedition-lkw",
    formKeys: ["service-lead-freight"],
  },
  {
    id: "refrigerated",
    label: "Refrigerated",
    path: "/kuehltransporte",
    formKeys: ["service-lead-refrigerated"],
  },
  {
    id: "regularTours",
    label: "Regular tours",
    path: "/feste-routen",
    formKeys: ["service-lead-regularTours"],
  },
  {
    id: "international",
    label: "International",
    path: "/internationaler-versand",
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
  "/blog": "Blog",
  "/branchen": "Industries",
  "/tracking": "Tracking",
  "/ueber-uns": "About",
  "/kuriertransporte": "Courier transport",
  "/spedition-lkw": "Freight forwarding",
  "/kuehltransporte": "Refrigerated transport",
  "/feste-routen": "Fixed routes",
  "/internationaler-versand": "International shipping",
};
