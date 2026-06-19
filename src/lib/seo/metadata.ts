import { siteConfig } from "@/config/site";
import { indexingEnabled } from "@/lib/seo-config";
import {
  buildLanguageAlternates,
  buildLocalizedUrl,
} from "@/lib/seo-helpers";
import type { Locale } from "@/types/locale";
import type { Metadata } from "next";

type BuildMetadataOptions = {
  locale: Locale;
  title: string;
  description: string;
  path: `/${string}` | "/";
  keywords?: string[];
  noIndex?: boolean;
};

export function buildCanonicalUrl(
  locale: Locale,
  path: `/${string}` | "/",
): string {
  return buildLocalizedUrl(locale, path);
}

export function getBrandImageUrl(): string {
  return `${siteConfig.url}${siteConfig.brand.ogImage}`;
}

function buildSocialImages() {
  const imageUrl = getBrandImageUrl();

  return {
    openGraph: {
      images: [
        {
          url: imageUrl,
          width: 512,
          height: 512,
          alt: `${siteConfig.name} logo`,
        },
      ],
    },
    twitter: {
      images: [imageUrl],
    },
  };
}

function buildRobotsMetadata(noIndex?: boolean): Metadata["robots"] {
  if (!indexingEnabled || noIndex) {
    return { index: false, follow: false, noarchive: true };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

export function buildMetadata({
  locale,
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const canonical = buildCanonicalUrl(locale, path);
  const fullTitle = path === "/" ? title : `${title} | ${siteConfig.name}`;
  const socialImages = buildSocialImages();

  return {
    title: fullTitle,
    description,
    keywords: [
      "logistics",
      "courier",
      "express delivery",
      "freight",
      "Take & Bring",
      ...keywords,
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale,
      url: canonical,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      ...socialImages.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...socialImages.twitter,
    },
    robots: buildRobotsMetadata(noIndex),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: getBrandImageUrl(),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      contactType: "customer service",
      availableLanguage: siteConfig.locales,
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "07:00",
        closes: "20:00",
      },
    },
    sameAs: [siteConfig.social.whatsapp],
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    image: getBrandImageUrl(),
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    priceRange: "$$",
    openingHours: "Mo-Su 07:00-20:00",
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildWebPageJsonLd({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
