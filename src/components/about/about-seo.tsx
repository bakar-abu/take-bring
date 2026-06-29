import { JsonLd } from "@/components/shared/json-ld";
import { ABOUT_FAQ_KEYS, ABOUT_PAGE } from "@/config/about-page";
import {
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/metadata";
import { buildLocalizedUrl } from "@/lib/seo-helpers";
import { getTranslations } from "next-intl/server";

export async function AboutSeo({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.ueberUns" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const pageUrl = buildLocalizedUrl(locale, ABOUT_PAGE.path);
  const homeUrl = buildLocalizedUrl(locale, "/");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ABOUT_FAQ_KEYS.map((key) => ({
      "@type": "Question",
      name: t(`${key}Q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`${key}A`),
      },
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
        buildOrganizationJsonLd(),
        buildBreadcrumbJsonLd([
          { name: tNav("home"), url: homeUrl },
          { name: tNav("aboutUs"), url: pageUrl },
        ]),
        faqJsonLd,
      ]}
    />
  );
}
