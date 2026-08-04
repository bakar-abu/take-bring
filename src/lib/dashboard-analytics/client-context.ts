/**
 * Server-side visitor context: IP country (no GPS) + User-Agent platform.
 * Never requests browser geolocation permission.
 */

export type ClientPlatform = {
  device: string;
  browser: string;
  os: string;
};

const COUNTRY_NAMES: Record<string, string> = {
  RO: "Romania",
  DE: "Germany",
  AT: "Austria",
  CH: "Switzerland",
  NL: "Netherlands",
  BE: "Belgium",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  PT: "Portugal",
  PL: "Poland",
  HU: "Hungary",
  CZ: "Czechia",
  SK: "Slovakia",
  BG: "Bulgaria",
  GR: "Greece",
  GB: "United Kingdom",
  UK: "United Kingdom",
  IE: "Ireland",
  US: "United States",
  CA: "Canada",
  TR: "Turkey",
  UA: "Ukraine",
  MD: "Moldova",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  LU: "Luxembourg",
  XX: "Unknown",
  T1: "Tor / anonymizer",
};

export function countryLabel(code: string): string {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return "Unknown";
  return COUNTRY_NAMES[normalized] ?? normalized;
}

export function normalizeCountryCode(raw: string | null | undefined): string {
  const code = (raw || "").trim().toUpperCase();
  if (!code || code === "XX" || code.length !== 2) return "";
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return code;
}

/** Read approximate country from CDN headers (Vercel / Cloudflare). */
export function countryFromHeaders(headers: Headers): string {
  return normalizeCountryCode(
    headers.get("x-vercel-ip-country") ||
      headers.get("cf-ipcountry") ||
      headers.get("x-country-code"),
  );
}

export function parseUserAgent(uaRaw: string): ClientPlatform {
  const ua = uaRaw.trim();
  if (!ua) {
    return { device: "Unknown", browser: "Unknown", os: "Unknown" };
  }
  const lower = ua.toLowerCase();

  let device = "Desktop";
  if (
    /ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua) ||
    (lower.includes("macintosh") && lower.includes("touch"))
  ) {
    device = "Tablet";
  } else if (
    /mobi|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile|windows phone/i.test(
      ua,
    )
  ) {
    device = "Mobile";
  }

  let browser = "Other";
  if (/edg(?:e|a|ios)?\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera/i.test(ua)) browser = "Opera";
  else if (/samsungbrowser\//i.test(ua)) browser = "Samsung Internet";
  else if (/chrome\/|crios\//i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
  else if (/firefox\/|fxios\//i.test(ua)) browser = "Firefox";
  else if (/safari\//i.test(ua) && !/chrome|crios|android/i.test(ua))
    browser = "Safari";
  else if (/msie |trident\//i.test(ua)) browser = "Internet Explorer";

  let os = "Other";
  if (/windows nt/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/mac os x|macintosh/i.test(ua)) os = "macOS";
  else if (/cros/i.test(ua)) os = "ChromeOS";
  else if (/linux/i.test(ua)) os = "Linux";

  return { device, browser, os };
}

export function clientContextFromRequest(request: Request): {
  country: string;
  device: string;
  browser: string;
  os: string;
} {
  const platform = parseUserAgent(request.headers.get("user-agent") || "");
  return {
    country: countryFromHeaders(request.headers),
    device: platform.device,
    browser: platform.browser,
    os: platform.os,
  };
}
