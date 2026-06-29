import { siteConfig } from "@/config/site";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: siteConfig.locales,
  defaultLocale: siteConfig.defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/kuriertransporte": {
      de: "/kuriertransporte",
      en: "/courier-transport",
      ro: "/transport-curier",
    },
    "/spedition-lkw": {
      de: "/spedition-lkw",
      en: "/freight-forwarding",
      ro: "/expeditie-camion",
    },
    "/kuehltransporte": {
      de: "/kuehltransporte",
      en: "/refrigerated-transport",
      ro: "/transport-frigorific",
    },
    "/feste-routen": {
      de: "/feste-routen",
      en: "/regular-tours",
      ro: "/tururi-regulate",
    },
    "/internationaler-versand": {
      de: "/internationaler-versand",
      en: "/international-shipping",
      ro: "/transport-international",
    },
    "/tracking": {
      de: "/tracking",
      en: "/tracking",
      ro: "/tracking",
    },
    "/kontakt": {
      de: "/kontakt",
      en: "/contact",
      ro: "/contact",
    },
    "/ueber-uns": {
      de: "/ueber-uns",
      en: "/about-us",
      ro: "/despre-noi",
    },
    "/branchen": {
      de: "/branchen",
      en: "/industries",
      ro: "/industrii",
    },
    "/blog": {
      de: "/blog",
      en: "/blog",
      ro: "/blog",
    },
    "/blog/[slug]": {
      de: "/blog/[slug]",
      en: "/blog/[slug]",
      ro: "/blog/[slug]",
    },
    "/datenschutz": {
      de: "/datenschutz",
      en: "/privacy-policy",
      ro: "/politica-de-confidentialitate",
    },
    "/impressum": {
      de: "/impressum",
      en: "/legal-notice",
      ro: "/nota-legala",
    },
  },
});
