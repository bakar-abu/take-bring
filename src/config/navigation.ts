import { routing } from "@/lib/i18n/routing";

type AllPathnames = keyof typeof routing.pathnames;

/** Static (non-dynamic) pathnames usable as plain-string Link hrefs. */
export type AppPathname = Exclude<AllPathnames, `${string}[${string}`>;

export type ServiceLink = {
  labelKey:
    | "courier"
    | "freight"
    | "refrigerated"
    | "regularTours"
    | "international";
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
  {
    labelKey: "regularTours",
    href: "/feste-routen",
    icon: "ri-route-line",
  },
  {
    labelKey: "international",
    href: "/internationaler-versand",
    icon: "ri-ship-line",
  },
];
