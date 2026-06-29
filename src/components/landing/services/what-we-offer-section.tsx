"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Package,
  Ship,
  Snowflake,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { AppPathname } from "@/config/navigation";

const BG_IMAGE = "/images/what-we-offer-parallax-bg.webp";

const OFFERS: {
  id: string;
  Icon: LucideIcon;
  titleKey:
    | "offerFreightTitle"
    | "offerRefrigeratedTitle"
    | "offerCourierTitle"
    | "offerFixedRoutesTitle"
    | "offerLocalDeliveriesTitle"
    | "offerInternationalTitle";
  descriptionKey:
    | "offerFreightDesc"
    | "offerRefrigeratedDesc"
    | "offerCourierDesc"
    | "offerFixedRoutesDesc"
    | "offerLocalDeliveriesDesc"
    | "offerInternationalDesc";
  href: AppPathname;
  accent: string;
}[] = [
  {
    id: "freight",
    Icon: Truck,
    titleKey: "offerFreightTitle",
    descriptionKey: "offerFreightDesc",
    href: "/spedition-lkw",
    accent: "#abc629",
  },
  {
    id: "refrigerated",
    Icon: Snowflake,
    titleKey: "offerRefrigeratedTitle",
    descriptionKey: "offerRefrigeratedDesc",
    href: "/kuehltransporte",
    accent: "#7ec8e3",
  },
  {
    id: "courier",
    Icon: Package,
    titleKey: "offerCourierTitle",
    descriptionKey: "offerCourierDesc",
    href: "/kuriertransporte",
    accent: "#f4d03f",
  },
  {
    id: "fixed-routes",
    Icon: Truck,
    titleKey: "offerFixedRoutesTitle",
    descriptionKey: "offerFixedRoutesDesc",
    href: "/feste-routen",
    accent: "#e67e22",
  },
  {
    id: "local",
    Icon: MapPin,
    titleKey: "offerLocalDeliveriesTitle",
    descriptionKey: "offerLocalDeliveriesDesc",
    href: "/kuriertransporte",
    accent: "#2ecc71",
  },
  {
    id: "international",
    Icon: Ship,
    titleKey: "offerInternationalTitle",
    descriptionKey: "offerInternationalDesc",
    href: "/internationaler-versand",
    accent: "#9b59b6",
  },
];

function OfferCard({
  index,
  service,
  title,
  description,
}: {
  index: number;
  service: (typeof OFFERS)[number];
  title: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = service.Icon;
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      style={{ marginTop: index % 2 === 1 ? "2.5rem" : 0 }}
    >
      <Link
        href={service.href}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/60 hover:bg-white/15 hover:shadow-[0_24px_48px_rgba(0,0,0,0.35)] md:p-7"
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
          style={{ background: service.accent }}
          aria-hidden
        />

        <div className="mb-5 flex items-start justify-between gap-4">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 transition-colors group-hover:bg-primary group-hover:ring-primary/40"
            style={{ color: service.accent }}
          >
            <Icon className="h-6 w-6 text-white transition-colors group-hover:text-logo-bg" strokeWidth={1.75} />
          </span>
          <span className="font-mono text-3xl font-bold leading-none text-white/20 transition-colors group-hover:text-primary/80">
            {num}
          </span>
        </div>

        <h3 className="mb-2 text-lg font-bold text-white md:text-xl">{title}</h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-white/70 md:text-[15px]">
          {description}
        </p>

        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-light transition-all group-hover:gap-3">
          <span className="h-px w-8 bg-primary transition-all group-hover:w-12" aria-hidden />
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </Link>
    </motion.article>
  );
}

export function WhatWeOfferSection() {
  const t = useTranslations("servicesSection");
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]), {
    stiffness: 90,
    damping: 28,
  });
  const contentY = useSpring(useTransform(scrollYProgress, [0, 1], [60, -60]), {
    stiffness: 90,
    damping: 28,
  });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.6, 1, 1, 0.6]);

  return (
    <section
      ref={sectionRef}
      className="what-we-offer-parallax relative min-h-[110vh] overflow-hidden"
      aria-labelledby="what-we-offer-heading"
    >
      {/* Parallax background layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div className="absolute inset-0 scale-[1.25]" style={{ y: bgY }}>
          <Image
            src={BG_IMAGE}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-logo-bg/95 via-logo-bg/80 to-logo-bg/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-logo-bg via-transparent to-logo-bg/40" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(171,198,41,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(171,198,41,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <motion.div
        className="container-content relative z-10 px-4 py-20 md:px-8 md:py-28 lg:py-32"
        style={{ y: contentY }}
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(280px,380px)_1fr] lg:gap-16 xl:gap-20">
          {/* Sticky header column */}
          <motion.div
            className="lg:sticky lg:top-28 lg:self-start"
            style={{ opacity: headerOpacity }}
          >
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              {t("ourServices")}
            </p>

            <h2
              id="what-we-offer-heading"
              className="text-4xl font-extrabold leading-[1.1] text-white md:text-5xl xl:text-6xl"
            >
              {t("whatWeOffer")}
            </h2>

            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/65">
              {t("serviceDescription")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/kuriertransporte"
                className="cta-delivery-btn inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold shadow-lg transition-transform hover:scale-[1.02]"
              >
                {t("readMore")}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <span className="text-sm text-white/50">
                {OFFERS.length} {t("ourServices").toLowerCase()}
              </span>
            </div>

            <div className="mt-10 hidden h-px w-full max-w-xs bg-gradient-to-r from-primary via-primary/40 to-transparent lg:block" />
          </motion.div>

          {/* Staggered card grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {OFFERS.map((service, index) => (
              <OfferCard
                key={service.id}
                index={index}
                service={service}
                title={t(service.titleKey)}
                description={t(service.descriptionKey)}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
