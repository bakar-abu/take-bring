import {
  CTA_LABELS,
  LOCALE_LABELS,
  PAGE_LABELS,
  SERVICE_ANALYTICS,
} from "@/lib/dashboard-analytics/constants";
import { listAnalyticsEventsSince } from "@/lib/dashboard-analytics/storage";
import type {
  AnalyticsPeriod,
  WebsiteAnalyticsSnapshot,
} from "@/lib/dashboard-analytics/types";
import { formKeyLabel } from "@/lib/email-templates";
import { listLeads } from "@/lib/leads/storage";
import type { LeadListItem } from "@/lib/leads/types";

function periodDays(period: AnalyticsPeriod) {
  return period === "7d" ? 7 : 30;
}

function sinceIso(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

function stripLocalePrefix(path: string) {
  return path.replace(/^\/(en|de|ro)(?=\/|$)/, "") || "/";
}

function pctChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function filterLeadsByPeriod(leads: LeadListItem[], since: string) {
  const sinceMs = new Date(since).getTime();
  return leads.filter((lead) => {
    const created = new Date(lead.createdAt).getTime();
    return !Number.isNaN(created) && created >= sinceMs;
  });
}

function countUniqueVisitors(
  events: Array<{ event_type: string; visitor_id: string; session_id: string }>,
) {
  const ids = new Set<string>();
  for (const event of events) {
    if (event.event_type !== "page_view") continue;
    const id = event.visitor_id || event.session_id;
    if (id) ids.add(id);
  }
  return ids.size;
}

export async function getAnalyticsSnapshot(
  period: AnalyticsPeriod,
): Promise<WebsiteAnalyticsSnapshot> {
  const days = periodDays(period);
  const currentSince = sinceIso(days);
  const previousSince = sinceIso(days * 2);

  const [events, allLeads] = await Promise.all([
    listAnalyticsEventsSince(previousSince),
    listLeads(),
  ]);

  const currentEvents = events.filter((e) => e.created_at >= currentSince);
  const previousEvents = events.filter(
    (e) => e.created_at >= previousSince && e.created_at < currentSince,
  );

  const currentLeads = filterLeadsByPeriod(allLeads, currentSince);
  const previousLeads = filterLeadsByPeriod(allLeads, previousSince).filter(
    (lead) => lead.createdAt < currentSince,
  );

  const visitors = countUniqueVisitors(currentEvents);
  const previousVisitors = countUniqueVisitors(previousEvents);
  const leadsCount = currentLeads.length;
  const previousLeadsCount = previousLeads.length;

  const consentEvents = currentEvents.filter((e) => e.event_type === "consent");
  const accepted = consentEvents.filter(
    (e) => e.consent_value === "accepted",
  ).length;
  const rejected = consentEvents.filter(
    (e) => e.consent_value === "rejected",
  ).length;
  const consentTotal = accepted + rejected;
  const consentRate = consentTotal
    ? Number(((accepted / consentTotal) * 100).toFixed(1))
    : 0;

  const conversionRate =
    visitors > 0
      ? Number(((leadsCount / visitors) * 100).toFixed(2))
      : 0;

  const localeBuckets: Record<"ro" | "de" | "en", { visitors: Set<string>; leads: number }> = {
    ro: { visitors: new Set(), leads: 0 },
    de: { visitors: new Set(), leads: 0 },
    en: { visitors: new Set(), leads: 0 },
  };

  for (const event of currentEvents) {
    if (event.event_type !== "page_view") continue;
    const locale =
      event.locale === "ro" || event.locale === "en" || event.locale === "de"
        ? event.locale
        : "de";
    const id = event.visitor_id || event.session_id || event.id;
    localeBuckets[locale].visitors.add(id);
  }

  // Approximate locale leads by source page locale prefix when present
  for (const lead of currentLeads) {
    const match = lead.sourcePage.match(/^\/(en|de|ro)(?=\/|$)/);
    const locale = (match?.[1] as "ro" | "de" | "en" | undefined) ?? "de";
    localeBuckets[locale].leads += 1;
  }

  const totalLocaleVisitors =
    localeBuckets.ro.visitors.size +
    localeBuckets.de.visitors.size +
    localeBuckets.en.visitors.size;

  const locales = (["ro", "de", "en"] as const).map((locale) => {
    const rowVisitors = localeBuckets[locale].visitors.size;
    return {
      locale,
      label: LOCALE_LABELS[locale],
      visitors: rowVisitors,
      leads: localeBuckets[locale].leads,
      sharePct: totalLocaleVisitors
        ? Math.round((rowVisitors / totalLocaleVisitors) * 100)
        : 0,
    };
  });

  const leadCounts = new Map<string, number>();
  for (const lead of currentLeads) {
    const key = lead.formKey || "unknown";
    leadCounts.set(key, (leadCounts.get(key) ?? 0) + 1);
  }
  const leadSources = [...leadCounts.entries()]
    .map(([formKey, count]) => ({
      formKey,
      label: formKeyLabel(formKey),
      leads: count,
      sharePct: leadsCount ? Math.round((count / leadsCount) * 100) : 0,
    }))
    .sort((a, b) => b.leads - a.leads);

  const pageViewCounts = new Map<string, number>();
  const pageSessions = new Map<string, Set<string>>();
  for (const event of currentEvents) {
    if (event.event_type !== "page_view") continue;
    const path = stripLocalePrefix(event.path);
    pageViewCounts.set(path, (pageViewCounts.get(path) ?? 0) + 1);
    const set = pageSessions.get(path) ?? new Set<string>();
    set.add(event.session_id || event.visitor_id || event.id);
    pageSessions.set(path, set);
  }

  const services = SERVICE_ANALYTICS.map((service) => {
    const views = pageViewCounts.get(service.path) ?? 0;
    const formKeys = service.formKeys as readonly string[];
    const leads = currentLeads.filter((lead) =>
      formKeys.includes(lead.formKey),
    ).length;
    return {
      id: service.id,
      label: service.label,
      path: service.path,
      views,
      leads,
    };
  });

  const ctaClicks = new Map<string, number>();
  for (const event of currentEvents) {
    if (event.event_type !== "cta_click" || !event.cta_id) continue;
    ctaClicks.set(event.cta_id, (ctaClicks.get(event.cta_id) ?? 0) + 1);
  }

  const ctas = Object.keys(CTA_LABELS).map((id) => ({
    id,
    label: CTA_LABELS[id] ?? id,
    clicks: ctaClicks.get(id) ?? 0,
    conversions:
      id === "calculator"
        ? currentLeads.filter((l) => l.formKey === "price-calculator-form")
            .length
        : id === "contact" || id === "book-express"
          ? currentLeads.filter((l) => l.type === "contact").length
          : id === "newsletter"
            ? currentLeads.filter((l) => l.type === "newsletter").length
            : 0,
  }));

  const topPages = [...pageViewCounts.entries()]
    .map(([path, views]) => {
      const sessions = pageSessions.get(path)?.size ?? 0;
      return {
        path,
        label: PAGE_LABELS[path] || path,
        views,
        engagementRate: sessions
          ? Math.min(100, Math.round((views / sessions) * 40))
          : 0,
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const blogViews = new Map<string, { views: number; ctaClicks: number }>();
  for (const event of currentEvents) {
    const path = stripLocalePrefix(event.path);
    const match = path.match(/^\/blog\/([^/]+)/);
    if (!match) continue;
    const slug = match[1];
    const row = blogViews.get(slug) ?? { views: 0, ctaClicks: 0 };
    if (event.event_type === "page_view") row.views += 1;
    if (event.event_type === "cta_click") row.ctaClicks += 1;
    blogViews.set(slug, row);
  }

  const blogs = [...blogViews.entries()]
    .map(([slug, row]) => ({
      slug,
      title: slug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      views: row.views,
      ctaClicks: row.ctaClicks,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  return {
    period,
    kpis: {
      visitors,
      leads: leadsCount,
      conversionRate,
      consentRate,
      visitorsChangePct: pctChange(visitors, previousVisitors),
      leadsChangePct: pctChange(leadsCount, previousLeadsCount),
    },
    locales,
    leadSources,
    services,
    ctas,
    topPages,
    blogs,
  };
}
