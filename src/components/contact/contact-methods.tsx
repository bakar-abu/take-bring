"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { SectionTag } from "./contact-hero";

const EASE = [0.22, 1, 0.36, 1] as const;

const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;
const mailHref = `mailto:${siteConfig.contact.email}`;

export function ContactMethods() {
  const t = useTranslations("contactPage");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const methods = [
    {
      icon: Phone,
      accent: "#abc629",
      title: t("phoneTitle"),
      desc: t("phoneDesc"),
      value: siteConfig.contact.phone,
      action: t("phoneAction"),
      href: phoneHref,
    },
    {
      icon: Mail,
      accent: "#3498db",
      title: t("emailTitle"),
      desc: t("emailDesc"),
      value: siteConfig.contact.email,
      action: t("emailAction"),
      href: mailHref,
    },
    {
      icon: MessageCircle,
      accent: "#2ecc71",
      title: t("whatsappTitle"),
      desc: t("whatsappDesc"),
      value: t("whatsappValue"),
      action: t("whatsappAction"),
      href: siteConfig.social.whatsapp,
      external: true,
    },
    {
      icon: MapPin,
      accent: "#e67e22",
      title: t("visitTitle"),
      desc: t("visitDesc"),
      value: siteConfig.contact.address,
      action: t("visitAction"),
      href: "#contact-map",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="contact-methods-heading">
      <div className="container-content px-4 md:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <SectionTag>{t("methodsTag")}</SectionTag>
          <h2
            id="contact-methods-heading"
            className="text-3xl font-extrabold tracking-tight text-logo-bg md:text-4xl"
          >
            {t("methodsTitle")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            {t("methodsSubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {methods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.a
                key={method.title}
                href={method.href}
                target={method.external ? "_blank" : undefined}
                rel={method.external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 28 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
                className="group flex flex-col rounded-3xl border border-logo-bg/10 bg-[#f8f9f5] p-7 transition-all hover:-translate-y-1.5 hover:border-primary/40 hover:bg-white hover:shadow-[0_20px_52px_rgba(52,52,50,0.12)]"
              >
                <span
                  className="flex h-13 w-13 items-center justify-center rounded-2xl p-3 text-logo-bg shadow-sm"
                  style={{ background: method.accent }}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-logo-bg">
                  {method.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">
                  {method.desc}
                </p>
                <p className="mt-4 text-base font-bold text-logo-bg">
                  {method.value}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary-dark">
                  {method.action}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
          className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-logo-bg/10 bg-[#f8f9f5] px-6 py-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Clock className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="text-sm font-semibold text-logo-bg">
            {t("hoursLabel")}{" "}
            <span className="text-foreground/70">{t("hoursValue")}</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
