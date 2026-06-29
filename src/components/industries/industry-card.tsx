"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { IndustryItem } from "@/config/industries-page";

const EASE = [0.22, 1, 0.36, 1] as const;

function IndustryCard({
  industry,
  index,
}: {
  industry: IndustryItem;
  index: number;
}) {
  const t = useTranslations("industriesPage");
  const Icon = industry.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-logo-bg/10 bg-white shadow-[0_8px_40px_rgba(52,52,50,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(52,52,50,0.14)]"
    >
      <div
        className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
        style={{ background: industry.accent }}
      />
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={industry.image}
          alt={t(`${industry.id}Name`)}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-logo-bg/70 via-transparent to-transparent" />
        <span
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl shadow-lg"
          style={{ background: industry.accent, color: "#343432" }}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold text-logo-bg">
          {t(`${industry.id}Name`)}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/65">
          {t(`${industry.id}Desc`)}
        </p>
        <ul className="mt-4 space-y-1.5 border-t border-logo-bg/8 pt-4">
          {(["Service1", "Service2", "Service3"] as const).map((suffix) => (
            <li
              key={suffix}
              className="flex items-center gap-2 text-xs font-semibold text-logo-bg/80"
            >
              <ArrowUpRight className="h-3 w-3 shrink-0 text-primary" />
              {t(`${industry.id}${suffix}`)}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export { IndustryCard };
