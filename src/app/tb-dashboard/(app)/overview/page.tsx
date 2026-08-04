import { OverviewPanel } from "@/components/dashboard/overview-panel";
import { requireNavAccess } from "@/lib/dashboard-require-nav";
import { listUsers } from "@/lib/dashboard-users/storage";
import { listLeads } from "@/lib/leads/storage";
import { displayLeadValue } from "@/lib/leads/helpers";

export default async function OverviewPage() {
  const user = await requireNavAccess("overview");

  const [leads, users] = await Promise.all([
    listLeads().catch(() => []),
    listUsers().catch(() => []),
  ]);

  const recentLeadLabels = leads.slice(0, 3).map((lead) =>
    displayLeadValue(lead.fullName) === "—"
      ? displayLeadValue(lead.email)
      : displayLeadValue(lead.fullName),
  );

  return (
    <OverviewPanel
      leadCount={leads.length}
      userCount={users.length}
      recentLeadLabels={recentLeadLabels}
      role={user.role}
    />
  );
}
