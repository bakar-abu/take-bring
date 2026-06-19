import { JsonLd } from "@/components/shared/json-ld";
import { buildMetadata, buildWebPageJsonLd } from "@/lib/seo/metadata";
import { buildLocalizedUrl } from "@/lib/seo-helpers";
import type { Locale } from "@/types/locale";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type PageSeoConfig = {
  metadataKey: string;
  path: `/${string}` | "/";
  keywords?: string[];
};

export async function generatePageMetadata(
  locale: string,
  { metadataKey, path, keywords }: PageSeoConfig,
): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: `metadata.${metadataKey}`,
  });

  return buildMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    path,
    keywords,
  });
}

export async function PageSeo({
  locale,
  metadataKey,
  path,
}: PageSeoConfig & { locale: string }) {
  const t = await getTranslations({
    locale,
    namespace: `metadata.${metadataKey}`,
  });

  const pageUrl = buildLocalizedUrl(locale, path);

  return (
    <JsonLd
      data={buildWebPageJsonLd({
        title: t("title"),
        description: t("description"),
        url: pageUrl,
      })}
    />
  );
}
