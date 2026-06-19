import { routing } from "@/lib/i18n/routing";

export type AppPathname = keyof typeof routing.pathnames;

export type ServiceLink = {
  labelKey: "courier" | "freight" | "refrigerated" | "tracking";
  href: AppPathname;
  icon: string;
};

export const serviceLinks: ServiceLink[] = [
  { labelKey: "courier", href: "/kuriertransporte", icon: "ri-bike-line" },
  { labelKey: "freight", href: "/spedition-lkw", icon: "ri-truck-line" },
  {
    labelKey: "refrigerated",
    href: "/kuehltransporte",
    icon: "ri-snowy-line",
  },
  { labelKey: "tracking", href: "/tracking", icon: "ri-map-pin-line" },
];
