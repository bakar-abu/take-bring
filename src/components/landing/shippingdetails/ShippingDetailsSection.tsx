"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Route,
  Settings,
  Smartphone,
  Timer,
  TrendingUp,
  Truck,
  Users,
  Weight,
  type LucideIcon,
} from "lucide-react";

const HERO_IMAGE = "/images/fixed-routes-hero.webp";
const PLANNING_IMAGE = "/images/fixed-routes-planning.webp";

const FEATURES: { id: string; icon: LucideIcon }[] = [
  { id: "feature1", icon: Route },
  { id: "feature2", icon: Settings },
  { id: "feature3", icon: Truck },
  { id: "feature4", icon: Users },
  { id: "feature5", icon: Timer },
  { id: "feature6", icon: Smartphone },
];

const FACTORS: { id: string; icon: LucideIcon }[] = [
  { id: "factor1", icon: Weight },
  { id: "factor2", icon: Truck },
  { id: "factor3", icon: Clock },
  { id: "factor4", icon: Timer },
  { id: "factor5", icon: TrendingUp },
  { id: "factor6", icon: BarChart3 },
];

const BENEFITS = ["benefit1", "benefit2", "benefit3", "benefit4"] as const;

function FeatureCard({
  index,
  icon: Icon,
  title,
  text,
}: {
  index: number;
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group relative overflow-hidden rounded-2xl border border-logo-bg/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg md:p-7"
    >
      <span className="absolute -right-2 -top-4 font-mono text-6xl font-black text-logo-bg/[0.06] transition-colors group-hover:text-primary/10">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-logo-bg">
        <Icon className="h-6 w-6" strokeWidth={2} />
      </div>
      <h3 className="mb-2 text-lg font-bold text-logo-bg">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/65">{text}</p>
    </motion.div>
  );
}

export function ShippingDetailsSection() {
  const t = useTranslations("shippingDetailsSection");
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-80px" });

  return (
    <section className="overflow-hidden bg-[#f7f8f4]" aria-labelledby="shipping-details-heading">
      {/* ── Hero: content + image ── */}
      <div className="container-content px-4 py-16 md:px-8 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, x: -32 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
              {t("tag")}
            </p>
            <h2
              id="shipping-details-heading"
              className="text-3xl font-extrabold leading-tight text-logo-bg md:text-4xl xl:text-5xl"
            >
              {t("title")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg">
              {t("subtitle")}
            </p>
            <Link
              href="/kontakt"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-logo-bg px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary hover:text-logo-bg"
            >
              {t("bookOrder")}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="relative min-h-[320px] lg:min-h-[420px]"
          >
            <div
              className="relative h-full min-h-[320px] overflow-hidden rounded-3xl shadow-2xl lg:min-h-[420px]"
              style={{ clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0 100%)" }}
            >
              <Image
                src={HERO_IMAGE}
                alt={t("title")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-logo-bg/50 via-transparent to-transparent" />
            </div>
            <div
              className="absolute -bottom-4 -left-4 hidden h-24 w-24 rounded-2xl bg-primary lg:block"
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              aria-hidden
            />
          </motion.div>
        </div>
      </div>

      {/* ── 6 feature cards ── */}
      <div className="container-content px-4 pb-16 md:px-8 md:pb-20">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              index={index}
              icon={feature.icon}
              title={t(`${feature.id}Title`)}
              text={t(`${feature.id}Text`)}
            />
          ))}
        </div>
      </div>

      {/* ── Route optimization: image + factors ── */}
      <div className="bg-[] py-16 md:py-24">
        <div className="container-content px-4 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="relative min-h-[280px] overflow-hidden rounded-3xl shadow-2xl md:min-h-[380px]">
              <Image
                src={PLANNING_IMAGE}
                alt={t("considerationsTitle")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-logo-bg/30" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-logo-bg/90 to-transparent p-6 md:p-8">
                <p className="text-sm font-medium uppercase tracking-widest text-primary-light">
                  {t("tag")}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-[#343432] md:text-3xl">
                {t("considerationsTitle")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-logo-bg">
                {t("considerationsSubtitle")}
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {FACTORS.map((factor, index) => {
                  const Icon = factor.icon;
                  return (
                    <motion.li
                      key={factor.id}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-white/10"
                    >
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <span className="text-sm font-semibold text-logo-bg">
                        {t(factor.id)}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Benefits + CTA with background image ── */}
      <div className="relative overflow-hidden py-16 md:py-24">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-logo-bg/88" aria-hidden />

        <div className="container-content relative z-10 px-4 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="text-3xl font-extrabold text-white md:text-4xl">
              {t("benefitsTitle")}
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">
              {t("ctaPrompt")}
            </p>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {BENEFITS.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-left backdrop-blur-md"
                >
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" strokeWidth={2} />
                  <span className="font-semibold text-white">{t(benefit)}</span>
                </motion.li>
              ))}
            </ul>

            <Link
              href="/kontakt"
              className="cta-delivery-btn mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold shadow-xl"
            >
              {t("bookOrder")}
              <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
