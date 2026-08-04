import { notFound } from "next/navigation";
import { LeadDetailView } from "@/components/dashboard/lead-detail-view";
import { requireNavAccess } from "@/lib/dashboard-require-nav";
import { canMutateLeads } from "@/lib/dashboard-permissions";
import { getLeadById } from "@/lib/leads/storage";

export const dynamic = "force-dynamic";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const user = await requireNavAccess("leads");
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return (
    <LeadDetailView lead={lead} readOnly={!canMutateLeads(user.role)} />
  );
}
