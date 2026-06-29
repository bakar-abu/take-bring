import { JsonLd } from "@/components/shared/json-ld";
import { siteConfig } from "@/config/site";
import {
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/metadata";
import { buildLocalizedUrl } from "@/lib/seo-helpers";
import { getTranslations } from "next-intl/server";

export async function ContactSeo({ locale }: { locale: string }) {
  const tMeta = await getTranslations({ locale, namespace: "metadata.kontakt" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const pageUrl = buildLocalizedUrl(locale, "/kontakt");
  const homeUrl = buildLocalizedUrl(locale, "/");

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: tMeta("title"),
    description: tMeta("description"),
    url: pageUrl,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bergisch Gladbach",
        addressCountry: "DE",
      },
    },
  };

  return (
    <JsonLd
      data={[
        buildWebPageJsonLd({
          title: tMeta("title"),
          description: tMeta("description"),
          url: pageUrl,
        }),
        contactPageJsonLd,
        buildLocalBusinessJsonLd(),
        buildBreadcrumbJsonLd([
          { name: tNav("home"), url: homeUrl },
          { name: tNav("contact"), url: pageUrl },
        ]),
      ]}
    />
  );
}
