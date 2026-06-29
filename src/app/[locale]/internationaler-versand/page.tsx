import { ServicePage } from "@/components/services";
import { generatePageMetadata, PageSeo } from "@/lib/seo/page-helpers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

const PAGE = {
  metadataKey: "internationalerVersand",
  path: "/internationaler-versand" as const,
  keywords: ["international", "shipping", "customs", "export"],
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

export default async function InternationalerVersandPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageSeo locale={locale} {...PAGE} />
      <ServicePage serviceId="international" />
    </>
  );
}
