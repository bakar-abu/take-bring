import { JsonLd } from "@/components/shared/json-ld";
import { INDUSTRIES, INDUSTRIES_PAGE } from "@/config/industries-page";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/metadata";
import { buildLocalizedUrl } from "@/lib/seo-helpers";
import { getTranslations } from "next-intl/server";

export async function IndustriesSeo({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "industriesPage" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.branchen" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const pageUrl = buildLocalizedUrl(locale, INDUSTRIES_PAGE.path);
  const homeUrl = buildLocalizedUrl(locale, "/");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4, 5, 6].map((n) => ({
      "@type": "Question",
      name: t(`faq${n}Q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq${n}A`),
      },
    })),
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("gridTitle"),
    description: t("gridSubtitle"),
    itemListElement: INDUSTRIES.map((industry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: t(`${industry.id}Name`),
      description: t(`${industry.id}Desc`),
    })),
  };

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
          { name: tNav("industries"), url: pageUrl },
        ]),
        faqJsonLd,
        itemListJsonLd,
      ]}
    />
  );
}
