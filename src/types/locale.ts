export const locales = ["de", "en", "ro"] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  ro: "Română",
};

export const localeFlags: Record<Locale, string> = {
  de: "DE",
  en: "EN",
  ro: "RO",
};
