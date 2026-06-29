import type { LucideIcon } from "lucide-react";
import {
  Bike,
  Globe,
  Map,
  Snowflake,
  TrendingUp,
  Truck,
} from "lucide-react";

export type BlogPost = {
  slug: string;
  image: string;
  icon: LucideIcon;
  accent: string;
  date: string;
  readTime: number;
  featured?: boolean;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "europe-freight-forwarding-guide",
    image: "/images/service-freight-hero.webp",
    icon: Truck,
    accent: "#abc629",
    date: "2026-05-12",
    readTime: 8,
    featured: true,
  },
  {
    slug: "cold-chain-best-practices",
    image: "/images/service-refrigerated-hero.webp",
    icon: Snowflake,
    accent: "#3498db",
    date: "2026-04-28",
    readTime: 7,
  },
  {
    slug: "same-day-courier-business",
    image: "/images/service-courier-hero.webp",
    icon: Bike,
    accent: "#e67e22",
    date: "2026-04-09",
    readTime: 6,
  },
  {
    slug: "fixed-routes-supply-chain",
    image: "/images/fixed-routes-hero.webp",
    icon: Map,
    accent: "#9b59b6",
    date: "2026-03-22",
    readTime: 6,
  },
  {
    slug: "international-shipping-customs",
    image: "/images/service-international-hero.webp",
    icon: Globe,
    accent: "#2ecc71",
    date: "2026-03-05",
    readTime: 9,
  },
  {
    slug: "reduce-logistics-costs",
    image: "/images/what-we-offer-parallax-bg.webp",
    icon: TrendingUp,
    accent: "#f4d03f",
    date: "2026-02-18",
    readTime: 7,
  },
];

export const LOCALE_DATE_TAG: Record<string, string> = {
  en: "en-GB",
  de: "de-DE",
  ro: "ro-RO",
};

export function formatBlogDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(LOCALE_DATE_TAG[locale] ?? "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.slug !== slug).slice(0, limit);
}

export const BLOG_PAGE = {
  path: "/blog" as const,
  metadataKey: "blog",
  keywords: [
    "logistics blog",
    "freight forwarding tips",
    "cold chain logistics",
    "courier service insights",
    "supply chain Europe",
    "transport industry news",
  ],
};
