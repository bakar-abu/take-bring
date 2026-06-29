import { ContactPage, ContactSeo } from "@/components/contact";
import { generatePageMetadata } from "@/lib/seo/page-helpers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

const PAGE = {
  metadataKey: "kontakt",
  path: "/kontakt" as const,
  keywords: ["contact", "kontakt", "logistics contact", "Take & Bring contact"],
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

export default async function KontaktPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ContactSeo locale={locale} />
      <ContactPage />
    </>
  );
}
