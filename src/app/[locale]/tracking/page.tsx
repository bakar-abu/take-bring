import { TrackingPageView } from "@/components/tracking";
import { generatePageMetadata, PageSeo } from "@/lib/seo/page-helpers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

const PAGE = {
  metadataKey: "tracking",
  path: "/tracking" as const,
  keywords: ["tracking", "shipment"],
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale, PAGE);
}

export default async function TrackingPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  const initialTrackingId = typeof q === "string" ? q : "";

  return (
    <>
      <PageSeo locale={locale} {...PAGE} />
      <TrackingPageView initialTrackingId={initialTrackingId} />
    </>
  );
}
