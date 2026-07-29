import { OverviewPanel } from "@/components/dashboard/overview-panel";
import { listLeads } from "@/lib/leads/storage";
import { displayLeadValue } from "@/lib/leads/helpers";

export default async function OverviewPage() {
  const leads = await listLeads();
  const recentLeadLabels = leads.slice(0, 3).map((lead) =>
    displayLeadValue(lead.fullName) === "—"
      ? displayLeadValue(lead.email)
      : displayLeadValue(lead.fullName),
  );

  return (
    <OverviewPanel
      leadCount={leads.length}
      recentLeadLabels={recentLeadLabels}
    />
  );
}
