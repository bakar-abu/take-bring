export const COOKIE_CONSENT_KEY = "tb-cookie-consent";
export const COOKIE_CONSENT_EVENT = "tb-cookie-consent";

export type CookieConsentValue = "accepted" | "rejected";

/** Returns stored consent, or null if the visitor has not chosen yet. */
export function getCookieConsentValue(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (raw === "accepted" || raw === "rejected") return raw;
    return null;
  } catch {
    return null;
  }
}

export function hasCookieConsentDecision(): boolean {
  return getCookieConsentValue() !== null;
}
