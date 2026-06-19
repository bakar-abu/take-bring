const rawBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://take-bring.eu";

export const baseUrl = rawBaseUrl.replace(/\/+$/, "");

export const defaultOgImage = `${baseUrl}/assets/images/take-bring-favicon.png`;

/**
 * When false, search engines will not index the site (robots.txt disallow + noindex meta).
 * Set INDEXING_ENABLED=false in .env for staging / under construction.
 * Defaults to true if not set.
 */
export const indexingEnabled =
  process.env.INDEXING_ENABLED !== "false" &&
  process.env.INDEXING_ENABLED !== "0";
