"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";

const CARD_KEYS = ["1", "2", "3"] as const;
const AVATAR_COLORS = ["#ABC629", "#8FA622", "#D4E88A"] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

function TestimonialCard({
  title,
  text,
  name,
  role,
  initials,
  color,
  index,
}: {
  title: string;
  text: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
      className="group relative flex h-full flex-col rounded-3xl border border-logo-bg/8 bg-white p-8 shadow-[0_8px_40px_rgba(52,52,50,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_24px_56px_rgba(52,52,50,0.12)]"
    >
      <span className="absolute -top-4 right-6 flex h-12 w-12 items-center justify-center rounded-xl bg-logo-bg text-white shadow-lg">
        <Quote className="h-5 w-5" fill="currentColor" aria-hidden />
      </span>
      <h3 className="pr-8 text-lg font-extrabold text-logo-bg">{title}</h3>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/65 md:text-base">
        {text}
      </p>
      <div className="mt-6 flex items-center gap-4 border-t border-logo-bg/8 pt-6">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-logo-bg ring-2 ring-white"
          style={{ background: color }}
        >
          {initials}
        </span>
        <div>
          <p className="font-bold text-logo-bg">{name}</p>
          <p className="text-sm text-foreground/60">{role}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-0 rounded-b-3xl bg-primary transition-all duration-500 group-hover:w-full" />
    </motion.article>
  );
}

export function TestimonialsSection() {
  const t = useTranslations("testimonialsSection");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const testimonials = CARD_KEYS.map((key, i) => {
    const name = t(`authorName${key}`);
    return {
      id: key,
      title: t(`title${key}`),
      text: t(`quote${key}`),
      name,
      role: t(`jobTitle${key}`),
      initials: name
        .split(" ")
        .map((s) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      color: AVATAR_COLORS[i],
    };
  });

  return (
    <section
      className="bg-white py-20 md:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-logo-bg/70">
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden />
            {t("tag")}
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-3 text-base text-foreground/65">{t("subtitle")}</p>
        </motion.div>

        <div
          className="grid gap-6 pt-4 md:grid-cols-3 lg:gap-8"
          role="list"
          aria-label={t("subtitle")}
        >
          {testimonials.map((item, index) => (
            <div key={item.id} role="listitem">
              <TestimonialCard {...item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
