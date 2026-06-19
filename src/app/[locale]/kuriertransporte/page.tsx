import { generatePageMetadata, PageSeo } from "@/lib/seo/page-helpers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

const PAGE = {
  metadataKey: "kuriertransporte",
  path: "/kuriertransporte" as const,
  keywords: ["kurier", "express", "courier"],
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

export default async function KuriertransportePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageSeo locale={locale} {...PAGE} />
      <div className="container-content">
        {/* Kuriertransporte page HTML */}
      </div>
    </>
  );
}
