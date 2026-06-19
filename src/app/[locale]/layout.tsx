import "@/assets/styles/globals.css";
import "remixicon/fonts/remixicon.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/shared/json-ld";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig } from "@/config/site";
import { indexingEnabled } from "@/lib/seo-config";
import { buildLanguageAlternates } from "@/lib/seo-helpers";
import { routing } from "@/lib/i18n/routing";
import {
  buildLocalBusinessJsonLd,
  buildOrganizationJsonLd,
  getBrandImageUrl,
} from "@/lib/seo/metadata";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const brandImage = getBrandImageUrl();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    applicationName: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    manifest: "/manifest.webmanifest",
    alternates: {
      languages: buildLanguageAlternates("/"),
    },
    robots: indexingEnabled
      ? undefined
      : { index: false, follow: false, noarchive: true },
    openGraph: {
      locale,
      type: "website",
      siteName: siteConfig.name,
      images: [
        {
          url: brandImage,
          width: 512,
          height: 512,
          alt: `${siteConfig.name} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [brandImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="min-h-dvh font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <JsonLd
            data={[buildOrganizationJsonLd(), buildLocalBusinessJsonLd()]}
          />
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
