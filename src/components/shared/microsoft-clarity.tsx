"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
  type CookieConsentValue,
} from "@/lib/cookie-consent";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function MicrosoftClarity() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        if (window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted") {
          setEnabled(true);
        }
      } catch {
        // ignore storage errors (e.g. private mode)
      }
    };

    syncFromStorage();

    const onConsent = (event: Event) => {
      const value = (event as CustomEvent<CookieConsentValue>).detail;
      if (value === "accepted") {
        setEnabled(true);
      }
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  if (!CLARITY_ID || !enabled) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `,
      }}
    />
  );
}
