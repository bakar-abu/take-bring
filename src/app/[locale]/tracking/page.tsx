import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

/**
 * Public shipment tracking is deferred (available on demand).
 * Keep the route so old links 404 cleanly instead of showing the demo UI.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Not Found",
    robots: { index: false, follow: false },
  };
}

export default async function TrackingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
