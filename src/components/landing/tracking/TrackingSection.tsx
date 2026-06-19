"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  BarChart3,
  Bell,
  Camera,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Package,
  PenTool,
  Radio,
  Route,
  Search,
  Smartphone,
  Truck,
  type LucideIcon,
} from "lucide-react";

const APP_IMAGE = "/images/tracking-app-hero.webp";
const DASHBOARD_IMAGE = "/images/tracking-dashboard.webp";

type FeatureGroup = {
  id: string;
  labelKey: "groupVisibility" | "groupFleet" | "groupAnalytics";
  icon: LucideIcon;
  features: { id: string; icon: LucideIcon }[];
};

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: "visibility",
    labelKey: "groupVisibility",
    icon: MapPin,
    features: [
      { id: "feature1", icon: MapPin },
      { id: "feature2", icon: CheckCircle },
      { id: "feature3", icon: PenTool },
      { id: "feature4", icon: Camera },
      { id: "feature5", icon: Clock },
      { id: "feature6", icon: Bell },
    ],
  },
  {
    id: "fleet",
    labelKey: "groupFleet",
    icon: Truck,
    features: [
      { id: "feature7", icon: Route },
      { id: "feature8", icon: Truck },
      { id: "feature11", icon: Radio },
      { id: "feature12", icon: Package },
    ],
  },
  {
    id: "analytics",
    labelKey: "groupAnalytics",
    icon: BarChart3,
    features: [
      { id: "feature9", icon: BarChart3 },
      { id: "feature10", icon: FileText },
    ],
  },
];

function FeatureTile({
  icon: Icon,
  title,
  text,
  index,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-white/10 md:p-5"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary transition-colors group-hover:bg-primary group-hover:text-logo-bg">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <h4 className="font-bold text-white">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-white/65">{text}</p>
      </div>
    </motion.div>
  );
}

export function TrackingSection() {
  const t = useTranslations("trackingSection");
  const [trackingId, setTrackingId] = useState("");
  const [activeGroup, setActiveGroup] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });

  const currentGroup = FEATURE_GROUPS[activeGroup];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      window.location.href = `/tracking?q=${encodeURIComponent(trackingId.trim())}`;
    }
  };

  return (
    <section className="overflow-hidden " aria-labelledby="tracking-heading">
      {/* ── Hero: dark panel + app image ── */}
      <div className="relative">
      

        <div className="container-content relative px-4 py-16 md:px-8 md:py-20 lg:py-24">
          <div
            ref={heroRef}
            className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
          >
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55 }}
            >
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Smartphone className="h-3.5 w-3.5 text-[#abc629]" strokeWidth={2.5} />
                {t("tag")}
              </p>
              <h2
                id="tracking-heading"
                className="text-3xl font-extrabold leading-tight text-[#343432] md:text-4xl xl:text-5xl"
              >
                {t("title")}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-logo-bg md:text-lg">
                {t("subtitle")}
              </p>

             
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="relative mx-auto w-full max-w-sm lg:max-w-md"
            >
              <div className="absolute -inset-4 rounded-[2.5rem] bg-primary/20 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[2rem] border-4 border-white/20 shadow-2xl">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={APP_IMAGE}
                    alt={t("title")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 80vw, 400px"
                    priority={false}
                  />
                </div>
              </div>
              <motion.div
                className="absolute -bottom-3 -left-3 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-logo-bg shadow-lg md:-left-6"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                GPS Live
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Features: dashboard image + grouped tabs ── */}
      <div className="relative py-16 md:py-24">
        <div className="container-content px-4 md:px-8">
          <div className="overflow-hidden rounded-3xl border border-logo-bg/10 bg-logo-bg shadow-2xl">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              {/* Dashboard image */}
              <div className="relative min-h-[240px] lg:min-h-full">
                <Image
                  src={DASHBOARD_IMAGE}
                  alt={t("dashboardImageAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-logo-bg/20 to-logo-bg/90 lg:bg-gradient-to-r lg:from-transparent lg:to-logo-bg" />
              </div>

              {/* Feature groups */}
              <div className="relative p-6 md:p-8 lg:p-10">
                <div className="mb-6 flex flex-wrap gap-2">
                  {FEATURE_GROUPS.map((group, index) => {
                    const GroupIcon = group.icon;
                    const isActive = index === activeGroup;
                    return (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => setActiveGroup(index)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-primary text-logo-bg shadow-md"
                            : "bg-white/10 text-white/75 hover:bg-white/15 hover:text-white"
                        }`}
                        aria-current={isActive ? "true" : undefined}
                      >
                        <GroupIcon className="h-4 w-4" strokeWidth={2} />
                        {t(group.labelKey)}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentGroup.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    {currentGroup.features.map((feature, index) => (
                      <FeatureTile
                        key={feature.id}
                        icon={feature.icon}
                        title={t(`${feature.id}Title`)}
                        text={t(`${feature.id}Text`)}
                        index={index}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                <Link
                  href="/tracking"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary-light"
                >
                  {t("button")}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
