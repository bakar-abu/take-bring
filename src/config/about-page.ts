import type { LucideIcon } from "lucide-react";
import {
  Award,
  Clock,
  Globe,
  Handshake,
  HeartHandshake,
  Leaf,
  Map,
  Package,
  Rocket,
  Send,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Target,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

export const ABOUT_STATS = ["stat1", "stat2", "stat3", "stat4"] as const;

export const ABOUT_VALUE_ICONS: LucideIcon[] = [
  ShieldCheck,
  Clock,
  HeartHandshake,
  Sparkles,
  Users,
  Leaf,
];
export const ABOUT_VALUES = [
  "value1",
  "value2",
  "value3",
  "value4",
  "value5",
  "value6",
] as const;

export const ABOUT_MILESTONES = [
  "milestone1",
  "milestone2",
  "milestone3",
  "milestone4",
  "milestone5",
] as const;

export type CapabilityItem = {
  key: string;
  icon: LucideIcon;
  href: "/spedition-lkw" | "/kuehltransporte" | "/kuriertransporte" | "/feste-routen" | "/internationaler-versand";
  accent: string;
};

export const ABOUT_CAPABILITIES: CapabilityItem[] = [
  { key: "capability1", icon: Truck, href: "/spedition-lkw", accent: "#abc629" },
  { key: "capability2", icon: Snowflake, href: "/kuehltransporte", accent: "#3498db" },
  { key: "capability3", icon: Send, href: "/kuriertransporte", accent: "#e67e22" },
  { key: "capability4", icon: Map, href: "/feste-routen", accent: "#9b59b6" },
  { key: "capability5", icon: Globe, href: "/internationaler-versand", accent: "#2ecc71" },
];

export const ABOUT_METRICS = ["metric1", "metric2", "metric3"] as const;

export const ABOUT_TEAM = ["member1", "member2", "member3", "member4"] as const;

export const ABOUT_AWARD_ICONS: LucideIcon[] = [Award, ShieldCheck, Leaf, Globe];
export const ABOUT_AWARDS = ["award1", "award2", "award3", "award4"] as const;

export const ABOUT_TRUST = [
  "trust1",
  "trust2",
  "trust3",
  "trust4",
  "trust5",
  "trust6",
] as const;

export const ABOUT_FAQ_KEYS = [
  "faq1",
  "faq2",
  "faq3",
  "faq4",
  "faq5",
  "faq6",
] as const;

export const ABOUT_DIFFERENTIATORS = [
  { key: "diff1", icon: Target },
  { key: "diff2", icon: Package },
  { key: "diff3", icon: TrendingUp },
  { key: "diff4", icon: Handshake },
] as const;

export const ABOUT_PAGE = {
  path: "/ueber-uns" as const,
  metadataKey: "ueberUns",
  keywords: [
    "about Take & Bring",
    "logistics company Europe",
    "freight forwarder history",
    "courier company team",
    "transport company values",
    "logistics partner Germany Romania",
  ],
  heroImage: "/images/about-hero.webp",
  storyImage: "/images/about-section-take-bring.webp",
  teamImage: "/images/about-team.webp",
  missionIcon: Rocket,
};
