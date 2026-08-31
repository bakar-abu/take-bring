"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { hasCookieConsentDecision } from "@/lib/cookie-consent";

const STORAGE_KEY = "tb-exit-intent-shown";
const MIN_ENGAGE_MS = 12_000;
const MOBILE_IDLE_MS = 28_000;
const MOBILE_MAX_WIDTH = 768;

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
}

function alreadyShownThisSession(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markShownThisSession(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore storage failures
  }
}

/**
 * Detects exit intent:
 * - Desktop: mouse leaves viewport toward the top (browser chrome)
 * - Mobile: idle after minimum engagement (no reliable "close tab" signal)
 * Shows once per session; waits until cookie consent is decided.
 */
export function useExitIntent() {
  const [isOpen, setIsOpen] = useState(false);
  const armedRef = useRef(false);
  const triggeredRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    if (triggeredRef.current || alreadyShownThisSession()) return;
    if (!armedRef.current) return;
    if (!hasCookieConsentDecision()) return;

    triggeredRef.current = true;
    markShownThisSession();
    setIsOpen(true);
  }, []);

  const dismiss = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (alreadyShownThisSession()) {
      triggeredRef.current = true;
      return;
    }

    const armTimer = window.setTimeout(() => {
      armedRef.current = true;
    }, MIN_ENGAGE_MS);

    const onMouseOut = (event: MouseEvent) => {
      if (isMobileViewport()) return;
      if (!armedRef.current || triggeredRef.current) return;
      if (!hasCookieConsentDecision()) return;

      const toElement = event.relatedTarget as Node | null;
      if (toElement) return;
      if (event.clientY > 0) return;

      trigger();
    };

    const resetIdle = () => {
      if (!isMobileViewport()) return;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (!armedRef.current || triggeredRef.current) return;

      idleTimerRef.current = setTimeout(() => {
        trigger();
      }, MOBILE_IDLE_MS);
    };

    document.addEventListener("mouseout", onMouseOut);

    const idleEvents: Array<keyof DocumentEventMap> = [
      "touchstart",
      "scroll",
      "keydown",
      "click",
    ];
    idleEvents.forEach((name) => {
      document.addEventListener(name, resetIdle, { passive: true });
    });

    const idleArmWatch = window.setInterval(() => {
      if (!armedRef.current || triggeredRef.current) return;
      if (!isMobileViewport()) return;
      if (idleTimerRef.current) return;
      resetIdle();
    }, 1000);

    return () => {
      window.clearTimeout(armTimer);
      window.clearInterval(idleArmWatch);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      document.removeEventListener("mouseout", onMouseOut);
      idleEvents.forEach((name) => {
        document.removeEventListener(name, resetIdle);
      });
    };
  }, [trigger]);

  return { isOpen, dismiss, trigger };
}
