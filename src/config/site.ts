import { locales, type Locale } from "@/types/locale";
import { baseUrl } from "@/lib/seo-config";

export const siteConfig = {
  name: "Take & Bring",
  legalName: "Take & Bring GmbH",
  url: baseUrl,
  defaultLocale: "ro" as Locale,
  locales,
  contact: {
    phone: "+49 2234 6889977",
    email: "info@take-bring.eu",
    hours: "07:00-20:00",
    address: "Bergisch Gladbach, Germany",
    mapEmbedUrl:
      process.env.NEXT_PUBLIC_MAP_EMBED_URL ??
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100493!2d7.133!3d50.992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bf255b8b8b8b8b%3A0x0!2sBergisch%20Gladbach%2C%20Germany!5e0!3m2!1sde!2sde!4v1718640000000!5m2!1sde!2sde",
  },
  social: {
    whatsapp: "https://wa.me/4922346889977",
  },
  brand: {
    favicon: "/assets/images/take-bring-favicon.png",
    ogImage: "/assets/images/take-bring-favicon.png",
  },
} as const;

export type SiteConfig = typeof siteConfig;
