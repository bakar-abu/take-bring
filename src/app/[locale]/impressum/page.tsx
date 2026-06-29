import { LegalPage, LegalSeo } from "@/components/legal";
import { generatePageMetadata } from "@/lib/seo/page-helpers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

const PAGE = {
  metadataKey: "impressum",
  path: "/impressum" as const,
  keywords: ["legal notice", "impressum", "imprint", "company information"],
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

export default async function ImpressumPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <LegalSeo
        locale={locale}
        metadataKey={PAGE.metadataKey}
        path={PAGE.path}
        navKey="legalNotice"
      />
      <LegalPage namespace="legalPage" />
    </>
  );
}
