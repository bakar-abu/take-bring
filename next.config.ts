import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Vercel Image Optimization returns 402 when the plan quota is exceeded.
    // Serve static /images assets directly instead of routing through /_next/image.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "take-bring.eu",
      },
    ],
  },
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
