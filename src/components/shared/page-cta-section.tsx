"use client";

import React from "react";
import Image from "next/image";

export const PAGE_CTA_BG = "/images/cta-band-bg.webp";

type PageCtaSectionProps = {
  id: string;
  children: React.ReactNode;
};

export function PageCtaSection({ id, children }: PageCtaSectionProps) {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-20"
      aria-labelledby={id}
    >
      <Image
        src={PAGE_CTA_BG}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-logo-bg/92 via-logo-bg/88 to-logo-bg/92" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(171,198,41,0.12),transparent_65%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #abc629 0, #abc629 1px, transparent 0, transparent 50%)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="container-content relative z-10 px-4 md:px-8">
        {children}
      </div>
    </section>
  );
}
