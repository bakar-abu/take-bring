import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const icon = siteConfig.brand.favicon;

  return {
    name: siteConfig.name,
    short_name: "Take & Bring",
    description: "Courier & Logistics Services",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ABC629",
    icons: [
      {
        src: icon,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: icon,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
