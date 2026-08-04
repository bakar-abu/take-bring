import { WebsiteAnalyticsPanel } from "@/components/dashboard/website-analytics-panel";
import { getAnalyticsSnapshot } from "@/lib/dashboard-analytics/snapshot";
import { listLeads } from "@/lib/leads/storage";
import type { LeadListItem } from "@/lib/leads/types";
import type { WebsiteAnalyticsSnapshot } from "@/lib/dashboard-analytics/types";

export const dynamic = "force-dynamic";

export default async function WebsiteAnalyticsPage() {
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();

  let initialSnapshot: WebsiteAnalyticsSnapshot | null = null;
  let storedLeads: LeadListItem[] = [];
  try {
    const [snapshot, leads] = await Promise.all([
      getAnalyticsSnapshot("30d"),
      listLeads(),
    ]);
    initialSnapshot = snapshot;
    storedLeads = leads;
  } catch (error) {
    console.error("[website-analytics]", error);
  }

  return (
    <WebsiteAnalyticsPanel
      initialSnapshot={initialSnapshot}
      storedLeads={storedLeads}
      clarityProjectId={clarityProjectId}
    />
  );
}
