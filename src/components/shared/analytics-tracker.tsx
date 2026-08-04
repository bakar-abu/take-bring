"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
  type CookieConsentValue,
} from "@/lib/cookie-consent";

const SESSION_KEY = "tb-analytics-session";
const VISITOR_KEY = "tb-analytics-visitor";

function hasAnalyticsConsent() {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

function readOrCreateId(key: string) {
  try {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(key, id);
    return id;
  } catch {
    return `tmp-${Date.now()}`;
  }
}

function detectLocale(pathname: string) {
  // /en/... → English, /de/... → German, unprefixed `/` → Romanian (default)
  const match = pathname.match(/^\/(en|de|ro)(?=\/|$)/);
  return match?.[1] ?? "ro";
}

function stripLocale(pathname: string) {
  return pathname.replace(/^\/(en|de|ro)(?=\/|$)/, "") || "/";
}

async function sendEvent(payload: Record<string, unknown>) {
  try {
    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // ignore network errors
  }
}

function resolveCtaId(target: HTMLElement): string | null {
  const explicit = target.closest<HTMLElement>("[data-analytics-cta]");
  if (explicit?.dataset.analyticsCta) {
    return explicit.dataset.analyticsCta;
  }

  const anchor = target.closest("a");
  if (anchor) {
    const href = (anchor.getAttribute("href") || "").toLowerCase();
    if (href.startsWith("tel:")) return "call";
    if (href.includes("wa.me") || href.includes("whatsapp")) return "whatsapp";
    if (href.includes("/tracking")) return "track";
    if (href.includes("/kontakt") || href.includes("/contact")) return "contact";
  }

  const button = target.closest("button");
  const label = (
    button?.textContent ||
    anchor?.textContent ||
    ""
  )
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  if (label.includes("whatsapp")) return "whatsapp";
  if (label.includes("call") || label.includes("anrufen")) return "call";
  if (label.includes("track")) return "track";
  if (label.includes("calculate") || label.includes("preis")) return "calculator";
  if (label.includes("express") || label.includes("book")) return "book-express";
  if (label.includes("newsletter") || label.includes("subscribe")) {
    return "newsletter";
  }

  return null;
}

/**
 * Consent-gated first-party analytics (page views + CTA clicks + consent events).
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    const trackPageView = (path: string) => {
      if (!hasAnalyticsConsent()) return;
      if (!path || path === lastPathRef.current) return;
      lastPathRef.current = path;

      void sendEvent({
        eventType: "page_view",
        path: stripLocale(path),
        locale: detectLocale(path),
        referrer: document.referrer || "",
        sessionId: readOrCreateId(SESSION_KEY),
        visitorId: readOrCreateId(VISITOR_KEY),
      });
    };

    const onConsent = (event: Event) => {
      const value = (event as CustomEvent<CookieConsentValue>).detail;
      void sendEvent({
        eventType: "consent",
        path: stripLocale(window.location.pathname),
        locale: detectLocale(window.location.pathname),
        consentValue: value,
        sessionId: readOrCreateId(SESSION_KEY),
        visitorId: readOrCreateId(VISITOR_KEY),
      });

      if (value === "accepted") {
        lastPathRef.current = "";
        trackPageView(window.location.pathname);
      }
    };

    const onClick = (event: MouseEvent) => {
      if (!hasAnalyticsConsent()) return;
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const ctaId = resolveCtaId(target);
      if (!ctaId) return;

      void sendEvent({
        eventType: "cta_click",
        ctaId,
        path: stripLocale(window.location.pathname),
        locale: detectLocale(window.location.pathname),
        sessionId: readOrCreateId(SESSION_KEY),
        visitorId: readOrCreateId(VISITOR_KEY),
        meta: ctaId.startsWith("floating-")
          ? { source: "floating_widget" }
          : {},
      });
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    document.addEventListener("click", onClick, true);

    if (hasAnalyticsConsent()) {
      trackPageView(pathname);
    }

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
      document.removeEventListener("click", onClick, true);
    };
  }, [pathname]);

  return null;
}
