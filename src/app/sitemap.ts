import type { MetadataRoute } from "next";
import { baseUrl, indexingEnabled } from "@/lib/seo-config";
import { buildLanguageAlternates } from "@/lib/seo-helpers";
import { routing } from "@/lib/i18n/routing";
import type { Locale } from "@/types/locale";

type PathnameKey = keyof typeof routing.pathnames;

function getLocalizedPath(
  pathConfig: (typeof routing.pathnames)[PathnameKey],
  locale: Locale,
): string {
  if (typeof pathConfig === "string") return pathConfig;
  return (pathConfig as Record<Locale, string>)[locale];
}

const pathnames = Object.keys(routing.pathnames) as PathnameKey[];
const defaultLocale = routing.defaultLocale as Locale;

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingEnabled) {
    return [];
  }

  const lastModified = new Date();

  return pathnames.map((pathname) => {
    const pathConfig = routing.pathnames[pathname];
    const localizedPath = getLocalizedPath(pathConfig, defaultLocale);
    const internalPath = pathname as PathnameKey | "/";

    const url =
      localizedPath === "/"
        ? baseUrl
        : `${baseUrl}${localizedPath}`;

    return {
      url,
      lastModified,
      changeFrequency: pathname === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: pathname === "/" ? 1 : 0.8,
      alternates: {
        languages: buildLanguageAlternates(internalPath),
      },
    };
  });
}
