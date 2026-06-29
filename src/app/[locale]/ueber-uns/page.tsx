import { AboutPage } from "@/components/about/about-page";
import { AboutSeo } from "@/components/about/about-seo";
import { ABOUT_PAGE } from "@/config/about-page";
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
    metadataKey: ABOUT_PAGE.metadataKey,
    path: ABOUT_PAGE.path,
    keywords: ABOUT_PAGE.keywords,
  });
}

export default async function UeberUnsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutSeo locale={locale} />
      <AboutPage />
    </>
  );
}
