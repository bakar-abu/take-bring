import { ServicePage } from "@/components/services";
import { generatePageMetadata, PageSeo } from "@/lib/seo/page-helpers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

const PAGE = {
  metadataKey: "lebensmittelLieferservice",
  path: "/lebensmittel-lieferservice" as const,
  keywords: [
    "food delivery",
    "cold chain",
    "HACCP",
    "refrigerated food",
    "gastronomy",
  ],
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale, PAGE);
}

export default async function LebensmittelLieferservicePage({
  params,
}: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageSeo locale={locale} {...PAGE} />
      <ServicePage serviceId="foodDelivery" />
    </>
  );
}
