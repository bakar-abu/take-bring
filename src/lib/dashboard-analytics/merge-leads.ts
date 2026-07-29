import { formKeyLabel } from "@/lib/email-templates";
import type { LeadListItem } from "@/lib/leads/types";
import type {
  LeadSourceRow,
  WebsiteAnalyticsSnapshot,
} from "@/lib/dashboard-analytics/types";

/**
 * Merge first-party lead counts into the analytics snapshot when stored leads exist.
 * Traffic/CTA/page metrics stay mock until GA4/Clarity integration.
 */
export function applyRealLeadSources(
  snapshot: WebsiteAnalyticsSnapshot,
  leads: LeadListItem[],
): WebsiteAnalyticsSnapshot {
  if (leads.length === 0) return snapshot;

  const counts = new Map<string, number>();
  for (const lead of leads) {
    const key = lead.formKey || "unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const total = leads.length;
  const leadSources: LeadSourceRow[] = [...counts.entries()]
    .map(([formKey, count]) => ({
      formKey,
      label: formKeyLabel(formKey),
      leads: count,
      sharePct: total ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.leads - a.leads);

  const conversionRate =
    snapshot.kpis.visitors > 0
      ? Number(((total / snapshot.kpis.visitors) * 100).toFixed(2))
      : snapshot.kpis.conversionRate;

  return {
    ...snapshot,
    leadSources,
    kpis: {
      ...snapshot.kpis,
      leads: total,
      conversionRate,
    },
  };
}
