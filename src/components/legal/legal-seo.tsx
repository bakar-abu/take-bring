import { JsonLd } from "@/components/shared/json-ld";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/metadata";
import { buildLocalizedUrl } from "@/lib/seo-helpers";
import type { InternalPath } from "@/lib/seo-helpers";
import { getTranslations } from "next-intl/server";

export async function LegalSeo({
  locale,
  metadataKey,
  path,
  navKey,
}: {
  locale: string;
  metadataKey: string;
  path: InternalPath;
  navKey: string;
}) {
  const tMeta = await getTranslations({ locale, namespace: `metadata.${metadataKey}` });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const pageUrl = buildLocalizedUrl(locale, path);
  const homeUrl = buildLocalizedUrl(locale, "/");

  return (
    <JsonLd
      data={[
        buildWebPageJsonLd({
          title: tMeta("title"),
          description: tMeta("description"),
          url: pageUrl,
        }),
        buildBreadcrumbJsonLd([
          { name: tNav("home"), url: homeUrl },
          { name: tFooter(navKey), url: pageUrl },
        ]),
      ]}
    />
  );
}
