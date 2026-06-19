import { siteConfig } from "@/config/site";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: siteConfig.locales,
  defaultLocale: siteConfig.defaultLocale,
  localePrefix: "as-needed",
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
  },
});
