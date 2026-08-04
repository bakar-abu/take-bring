import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { AnalyticsEventInput } from "@/lib/dashboard-analytics/constants";

export type AnalyticsEventRow = {
  id: string;
  created_at: string;
  event_type: string;
  path: string;
  locale: string;
  referrer: string;
  cta_id: string;
  consent_value: string;
  session_id: string;
  visitor_id: string;
  meta: Record<string, unknown> | null;
};

function cleanPath(path: string) {
  const trimmed = path.trim() || "/";
  try {
    if (trimmed.startsWith("http")) {
      return new URL(trimmed).pathname || "/";
    }
  } catch {
    // keep trimmed
  }
  const noHash = trimmed.split("#")[0] ?? trimmed;
  const noQuery = noHash.split("?")[0] ?? noHash;
  const normalized = noQuery.replace(/\/+/g, "/");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function normalizeLocale(locale: string) {
  const value = locale.trim().toLowerCase();
  if (value === "ro" || value === "de" || value === "en") return value;
  return "de";
}

export async function insertAnalyticsEvent(
  input: AnalyticsEventInput,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("analytics_events").insert({
    event_type: input.eventType,
    path: cleanPath(input.path || "/"),
    locale: normalizeLocale(input.locale || "de"),
    referrer: (input.referrer || "").slice(0, 500),
    cta_id: (input.ctaId || "").slice(0, 120),
    consent_value: input.consentValue || "",
    session_id: (input.sessionId || "").slice(0, 120),
    visitor_id: (input.visitorId || "").slice(0, 120),
    meta: input.meta ?? {},
  });

  if (error) throw new Error(error.message);
}

export async function listAnalyticsEventsSince(
  sinceIso: string,
): Promise<AnalyticsEventRow[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("analytics_events")
    .select(
      "id, created_at, event_type, path, locale, referrer, cta_id, consent_value, session_id, visitor_id, meta",
    )
    .gte("created_at", sinceIso)
    .order("created_at", { ascending: false })
    .limit(20000);

  if (error) throw new Error(error.message);
  return (data ?? []) as AnalyticsEventRow[];
}
