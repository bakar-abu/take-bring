import { IndustriesPage } from "@/components/industries/industries-page";
import { IndustriesSeo } from "@/components/industries/industries-seo";
import { INDUSTRIES_PAGE } from "@/config/industries-page";
import { generatePageMetadata } from "@/lib/seo/page-helpers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale, {
    metadataKey: INDUSTRIES_PAGE.metadataKey,
    path: INDUSTRIES_PAGE.path,
    keywords: INDUSTRIES_PAGE.keywords,
  });
}

export default async function BranchenPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <IndustriesSeo locale={locale} />
      <IndustriesPage />
    </>
  );
}
