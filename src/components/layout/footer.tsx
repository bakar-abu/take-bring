"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { motion, useInView } from "framer-motion";
import takeBringLogo from "@/assets/images/take-bring-logo.png";
import { serviceLinks } from "@/config/navigation";

const SOCIAL_LINKS = [
  { href: "https://facebook.com", icon: "ri-facebook-fill", labelKey: "Facebook" },
  { href: "https://twitter.com", icon: "ri-twitter-x-fill", labelKey: "Twitter" },
  { href: "https://youtube.com", icon: "ri-youtube-fill", labelKey: "YouTube" },
  { href: "https://linkedin.com", icon: "ri-linkedin-fill", labelKey: "LinkedIn" },
] as const;

const EASE_OUT = [0, 0, 0.58, 1] as const;
const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

const leftPanelVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

const socialVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: EASE_SPRING },
  },
};

const rightPanelVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
      delay: 0.15,
    },
  },
};

const bottomBarVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE_OUT,
      delay: 0.85,
    },
  },
};

export function Footer() {
  const t = useTranslations("footer");
  const tServices = useTranslations("servicesDropdown");
  const year = new Date().getFullYear();
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <footer
      ref={ref}
      className="footer-root relative w-full overflow-hidden bg-white pt-24"
    >
      <div className="footer-inner flex min-h-[320px] flex-col lg:flex-row">
        <motion.div
          className="footer-left relative flex w-full flex-shrink-0 flex-col justify-center px-8 py-10 lg:w-[33%] lg:max-w-[400px] lg:py-14 lg:pr-14 lg:pl-14"
          variants={leftPanelVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35, ease: EASE_OUT }}
            >
              <Link href="/" className="inline-block">
                <Image
                  src={takeBringLogo}
                  alt={t("logoAlt")}
                  width={180}
                  height={56}
                  className="object-contain"
                />
              </Link>
            </motion.div>

            <motion.p
              className="mt-5 text-sm font-medium text-white"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.45, ease: EASE_OUT }}
            >
              {t("findUsSocial")}
            </motion.p>

            <motion.ul
              className="mt-3 flex gap-3"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {SOCIAL_LINKS.map(({ href, icon, labelKey }) => (
                <motion.li key={labelKey} variants={socialVariants}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-dark transition-all duration-200 hover:scale-110 hover:shadow-lg"
                    aria-label={labelKey}
                  >
                    <i className={`${icon} text-lg`} aria-hidden />
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>

        <motion.div
          className="footer-right relative flex-1 overflow-hidden px-6 py-10 text-primary-dark lg:px-12 lg:py-14"
          variants={rightPanelVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Image
            src="/images/footer-bg.webp"
            alt=""
            fill
            className="object-cover object-center lg:object-right"
            sizes="(max-width: 1024px) 100vw, 70vw"
            aria-hidden
          />
          <div
            className="footer-right-overlay pointer-events-none absolute inset-0"
            aria-hidden
          />
          <motion.div
            className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.nav variants={itemVariants}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                {t("company")}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {[
                  { href: "/" as const, key: "home" },
                  { href: "/ueber-uns" as const, key: "about" },
                  { href: "/kuriertransporte" as const, key: "ourServices" },
                  { href: "/kontakt" as const, key: "contact" },
                ].map(({ href, key }) => (
                  <li key={key}>
                    <Link
                      href={href}
                      className="text-sm font-medium text-primary-dark transition-colors hover:text-primary hover:underline"
                    >
                      {t(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.nav variants={itemVariants}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                {t("services")}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {serviceLinks.map(({ href, labelKey }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm font-medium text-primary-dark transition-colors hover:text-primary hover:underline"
                    >
                      {tServices(labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.div variants={itemVariants}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                {t("workingHours")}
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm font-medium text-primary-dark">
                <div className="flex justify-between">
                  <dt>{t("monFri")}</dt>
                  <dd>{t("hoursMonFri")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{t("sat")}</dt>
                  <dd>{t("hoursSat")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{t("sunHolidays")}</dt>
                  <dd>{t("hoursSun")}</dd>
                </div>
              </dl>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 border-t border-primary/20 bg-white px-6 py-4 text-center text-sm text-primary-dark"
        variants={bottomBarVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <span>{t("copyright", { year })}</span>
      </motion.div>
    </footer>
  );
}
