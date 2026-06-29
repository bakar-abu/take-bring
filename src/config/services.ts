import type { AppPathname } from "@/config/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  MapPin,
  Package,
  Plane,
  Route,
  Settings,
  Ship,
  Smartphone,
  Snowflake,
  Thermometer,
  Truck,
  Users,
  Zap,
} from "lucide-react";

export type ServiceId =
  | "freight"
  | "refrigerated"
  | "courier"
  | "regularTours"
  | "international";

export type HeroVariant = "split" | "centered" | "fullWidth";
export type FleetVariant = "default" | "reefer" | "compact" | "tabs";
export type StepsVariant = "vertical" | "horizontal";

export type FleetItem = {
  id: string;
  image: string;
  popular?: boolean;
  tabKey?: string;
};

export type ServiceConfig = {
  id: ServiceId;
  path: AppPathname;
  metadataKey: string;
  keywords: string[];
  accent: string;
  heroVariant: HeroVariant;
  fleetVariant: FleetVariant;
  stepsVariant: StepsVariant;
  stepCount: number;
  heroImage: string;
  operationsImage: string;
  fleetItems: FleetItem[];
  advantageImages: [string, string, string, string];
  manageFeatures: { id: string; icon: LucideIcon }[];
  stepIcons: LucideIcon[];
  inquiryType: string;
  showStatsRow?: boolean;
};

export const SERVICE_IDS: ServiceId[] = [
  "freight",
  "refrigerated",
  "courier",
  "regularTours",
  "international",
];

export const SERVICES: Record<ServiceId, ServiceConfig> = {
  freight: {
    id: "freight",
    path: "/spedition-lkw",
    metadataKey: "speditionLkw",
    keywords: ["freight", "spedition", "truck", "logistics"],
    accent: "#e67e22",
    heroVariant: "split",
    fleetVariant: "default",
    stepsVariant: "vertical",
    stepCount: 5,
    heroImage: "/images/service-freight-hero.webp",
    operationsImage: "/images/service-freight-operations.webp",
    fleetItems: [
      { id: "fleet1", image: "/images/fleet-truck-7-5t.webp" },
      { id: "fleet2", image: "/images/fleet-truck-12t.webp", popular: true },
      { id: "fleet3", image: "/images/fleet-truck-40t.webp" },
    ],
    advantageImages: [
      "/images/benefit-reliability.webp",
      "/images/benefit-flexibility.webp",
      "/images/benefit-expertise.webp",
      "/images/benefit-support.webp",
    ],
    manageFeatures: [
      { id: "manage1", icon: Settings },
      { id: "manage2", icon: Route },
      { id: "manage3", icon: FileText },
      { id: "manage4", icon: Smartphone },
    ],
    stepIcons: [FileText, Route, Truck, Globe, CheckCircle],
    inquiryType: "freight",
  },
  refrigerated: {
    id: "refrigerated",
    path: "/kuehltransporte",
    metadataKey: "kuehltransporte",
    keywords: ["refrigerated", "cold chain", "temperature"],
    accent: "#7ec8e3",
    heroVariant: "centered",
    fleetVariant: "reefer",
    stepsVariant: "vertical",
    stepCount: 5,
    heroImage: "/images/service-refrigerated-hero.webp",
    operationsImage: "/images/service-refrigerated-monitoring.webp",
    fleetItems: [
      { id: "fleet1", image: "/images/service-refrigerated-fleet.webp" },
      { id: "fleet2", image: "/images/fleet-truck-12t.webp", popular: true },
      { id: "fleet3", image: "/images/service-refrigerated-fleet.webp" },
    ],
    advantageImages: [
      "/images/benefit-reliability.webp",
      "/images/benefit-flexibility.webp",
      "/images/benefit-expertise.webp",
      "/images/benefit-support.webp",
    ],
    manageFeatures: [
      { id: "manage1", icon: Thermometer },
      { id: "manage2", icon: Snowflake },
      { id: "manage3", icon: Route },
      { id: "manage4", icon: FileText },
    ],
    stepIcons: [Thermometer, Truck, Snowflake, Smartphone, CheckCircle],
    inquiryType: "refrigerated",
  },
  courier: {
    id: "courier",
    path: "/kuriertransporte",
    metadataKey: "kuriertransporte",
    keywords: ["courier", "express", "delivery"],
    accent: "#f4d03f",
    heroVariant: "fullWidth",
    fleetVariant: "compact",
    stepsVariant: "vertical",
    stepCount: 4,
    heroImage: "/images/service-courier-hero.webp",
    operationsImage: "/images/service-courier-fleet.webp",
    fleetItems: [
      { id: "fleet1", image: "/images/service-courier-fleet.webp" },
      { id: "fleet2", image: "/images/service-courier-fleet.webp", popular: true },
      { id: "fleet3", image: "/images/service-courier-fleet.webp" },
    ],
    advantageImages: [
      "/images/benefit-reliability.webp",
      "/images/benefit-flexibility.webp",
      "/images/benefit-expertise.webp",
      "/images/benefit-support.webp",
    ],
    manageFeatures: [
      { id: "manage1", icon: Zap },
      { id: "manage2", icon: Route },
      { id: "manage3", icon: Smartphone },
      { id: "manage4", icon: Clock },
    ],
    stepIcons: [FileText, Package, Truck, CheckCircle],
    inquiryType: "courier",
    showStatsRow: true,
  },
  regularTours: {
    id: "regularTours",
    path: "/feste-routen",
    metadataKey: "festeRouten",
    keywords: ["fixed routes", "regular tours", "scheduled"],
    accent: "#e67e22",
    heroVariant: "split",
    fleetVariant: "default",
    stepsVariant: "horizontal",
    stepCount: 5,
    heroImage: "/images/service-regular-tours-hero.webp",
    operationsImage: "/images/service-regular-tours-route-map.webp",
    fleetItems: [
      { id: "fleet1", image: "/images/fleet-truck-7-5t.webp" },
      { id: "fleet2", image: "/images/fleet-truck-12t.webp", popular: true },
      { id: "fleet3", image: "/images/fleet-truck-40t.webp" },
    ],
    advantageImages: [
      "/images/benefit-reliability.webp",
      "/images/benefit-flexibility.webp",
      "/images/benefit-expertise.webp",
      "/images/benefit-support.webp",
    ],
    manageFeatures: [
      { id: "manage1", icon: Route },
      { id: "manage2", icon: Clock },
      { id: "manage3", icon: Users },
      { id: "manage4", icon: BarChart3 },
    ],
    stepIcons: [FileText, Route, Users, Truck, BarChart3],
    inquiryType: "regularTours",
  },
  international: {
    id: "international",
    path: "/internationaler-versand",
    metadataKey: "internationalerVersand",
    keywords: ["international", "shipping", "customs", "export"],
    accent: "#9b59b6",
    heroVariant: "centered",
    fleetVariant: "tabs",
    stepsVariant: "vertical",
    stepCount: 5,
    heroImage: "/images/service-international-hero.webp",
    operationsImage: "/images/service-international-sea.webp",
    fleetItems: [
      { id: "fleet1", image: "/images/fleet-truck-40t.webp", tabKey: "tabRoad" },
      {
        id: "fleet2",
        image: "/images/service-international-sea.webp",
        tabKey: "tabSea",
        popular: true,
      },
      {
        id: "fleet3",
        image: "/images/service-international-air.webp",
        tabKey: "tabAir",
      },
    ],
    advantageImages: [
      "/images/benefit-reliability.webp",
      "/images/benefit-flexibility.webp",
      "/images/benefit-expertise.webp",
      "/images/benefit-support.webp",
    ],
    manageFeatures: [
      { id: "manage1", icon: FileText },
      { id: "manage2", icon: Globe },
      { id: "manage3", icon: Ship },
      { id: "manage4", icon: Plane },
    ],
    stepIcons: [FileText, Route, FileText, Globe, CheckCircle],
    inquiryType: "international",
  },
};

export function getServiceByPath(path: AppPathname): ServiceConfig | undefined {
  return Object.values(SERVICES).find((s) => s.path === path);
}
