"use client";

import { useEffect, useRef } from "react";
import Clarity from "@microsoft/clarity";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
  type CookieConsentValue,
} from "@/lib/cookie-consent";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();

/**
 * Consent-gated Microsoft Clarity via official `@microsoft/clarity` SDK.
 * Project ID comes from NEXT_PUBLIC_CLARITY_PROJECT_ID (e.g. xnbmal94h3).
 */
export function MicrosoftClarity() {
  const startedRef = useRef(false);

  useEffect(() => {
    if (!CLARITY_ID) return;

    const startClarity = () => {
      if (startedRef.current) return;
      try {
        Clarity.init(CLARITY_ID);
        startedRef.current = true;
      } catch (error) {
        console.error("[clarity] init failed", error);
      }
    };

    try {
      if (window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted") {
        startClarity();
      }
    } catch {
      // ignore storage errors (e.g. private mode)
    }

    const onConsent = (event: Event) => {
      const value = (event as CustomEvent<CookieConsentValue>).detail;
      if (value === "accepted") {
        startClarity();
      }
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  return null;
}
