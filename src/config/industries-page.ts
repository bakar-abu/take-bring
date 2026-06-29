import type { LucideIcon } from "lucide-react";
import {
  Award,
  Building2,
  Car,
  Factory,
  HeartPulse,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Utensils,
  Zap,
} from "lucide-react";

export type IndustryId =
  | "retail"
  | "manufacturing"
  | "food"
  | "healthcare"
  | "automotive"
  | "construction"
  | "technology"
  | "agriculture";

export type IndustryItem = {
  id: IndustryId;
  image: string;
  icon: LucideIcon;
  accent: string;
};

export const INDUSTRIES: IndustryItem[] = [
  {
    id: "retail",
    image: "/images/industry-retail.webp",
    icon: ShoppingBag,
    accent: "#abc629",
  },
  {
    id: "manufacturing",
    image: "/images/industry-manufacturing.webp",
    icon: Factory,
    accent: "#e67e22",
  },
  {
    id: "food",
    image: "/images/industry-food.webp",
    icon: Utensils,
    accent: "#7ec8e3",
  },
  {
    id: "healthcare",
    image: "/images/industry-healthcare.webp",
    icon: HeartPulse,
    accent: "#e74c3c",
  },
  {
    id: "automotive",
    image: "/images/industry-automotive.webp",
    icon: Car,
    accent: "#3498db",
  },
  {
    id: "construction",
    image: "/images/industry-construction.webp",
    icon: Building2,
    accent: "#f4d03f",
  },
  {
    id: "technology",
    image: "/images/industry-technology.webp",
    icon: Zap,
    accent: "#9b59b6",
  },
  {
    id: "agriculture",
    image: "/images/industry-agriculture.webp",
    icon: Leaf,
    accent: "#2ecc71",
  },
];

export const STATS = ["stat1", "stat2", "stat3", "stat4"] as const;
export const AWARDS = ["award1", "award2", "award3", "award4"] as const;
export const EXPERTISE = ["expertise1", "expertise2", "expertise3", "expertise4"] as const;
export const METRICS = ["metric1", "metric2", "metric3"] as const;
export const STEPS = ["step1", "step2", "step3", "step4", "step5"] as const;
export const STEP_ICONS = [Truck, ShieldCheck, Zap, Award, Building2] as const;
export const FAQ_KEYS = ["faq1", "faq2", "faq3", "faq4", "faq5", "faq6"] as const;
export const TRUST_ITEMS = ["trust1", "trust2", "trust3", "trust4"] as const;

export const INDUSTRIES_PAGE = {
  path: "/branchen" as const,
  metadataKey: "branchen",
  keywords: [
    "industry logistics",
    "sector transport",
    "B2B freight",
    "supply chain",
    "courier industries",
    "refrigerated logistics",
  ],
  heroImage: "/images/industries-hero.webp",
  expertiseImage: "/images/industries-expertise.webp",
};
