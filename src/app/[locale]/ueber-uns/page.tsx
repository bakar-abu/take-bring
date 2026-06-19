import { generatePageMetadata, PageSeo } from "@/lib/seo/page-helpers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

const PAGE = {
  metadataKey: "ueberUns",
  path: "/ueber-uns" as const,
  keywords: ["about", "über uns"],
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

export default async function UeberUnsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageSeo locale={locale} {...PAGE} />
      <div className="container-content">{/* Über uns page HTML */}</div>
    </>
  );
}
