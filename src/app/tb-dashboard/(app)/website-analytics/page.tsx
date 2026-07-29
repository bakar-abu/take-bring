import { WebsiteAnalyticsPanel } from "@/components/dashboard/website-analytics-panel";
import { listLeads } from "@/lib/leads/storage";

// TODO(integrate): When GA4/Clarity APIs are wired, pass real traffic snapshots
// instead of relying on mock analytics inside the panel.

export default async function WebsiteAnalyticsPage() {
  const storedLeads = await listLeads();
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();

  return (
    <WebsiteAnalyticsPanel
      storedLeads={storedLeads}
      clarityProjectId={clarityProjectId}
    />
  );
}
