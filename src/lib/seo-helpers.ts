import { routing } from "@/lib/i18n/routing";
import { baseUrl } from "@/lib/seo-config";
import type { Locale } from "@/types/locale";

type PathnameKey = keyof typeof routing.pathnames;
export type InternalPath = PathnameKey | "/" | `/${string}`;

function getValidLocale(locale: string): Locale {
  return routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;
}

function resolveLocalizedSegment(
  internalPath: InternalPath,
  locale: Locale,
): string {
  if (internalPath === "/") return "";

  const pathConfig = routing.pathnames[internalPath as PathnameKey];
  if (!pathConfig) return internalPath;
  if (typeof pathConfig === "string") return pathConfig;
  return pathConfig[locale];
}

/** URL path for a locale (no origin). Default locale has no /ro prefix. */
export function buildLocalizedPath(
  locale: string,
  internalPath: InternalPath,
): string {
  const validLocale = getValidLocale(locale);

  if (internalPath === "/") {
    return validLocale === routing.defaultLocale ? "" : `/${validLocale}`;
  }

  const segment = resolveLocalizedSegment(internalPath, validLocale);
  return validLocale === routing.defaultLocale
    ? segment
    : `/${validLocale}${segment}`;
}

export function buildLocalizedUrl(
  locale: string,
  internalPath: InternalPath,
): string {
  const localizedPath = buildLocalizedPath(locale, internalPath);
  if (!localizedPath) return baseUrl;
  return `${baseUrl}${localizedPath}`;
}

export function buildLanguageAlternates(
  internalPath: InternalPath,
): Record<string, string> {
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [
      loc,
      buildLocalizedUrl(loc, internalPath),
    ]),
  ) as Record<string, string>;

  languages["x-default"] = buildLocalizedUrl(
    routing.defaultLocale,
    internalPath,
  );

  return languages;
}
