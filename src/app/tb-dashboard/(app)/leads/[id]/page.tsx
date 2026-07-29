import { notFound } from "next/navigation";
import { LeadDetailView } from "@/components/dashboard/lead-detail-view";
import { getMockLeadById } from "@/lib/leads/mock-leads";

// TODO(integrate): When wiring real data, delete mock usage and use:
//   import { getLeadById } from "@/lib/leads/storage";
//   const lead = await getLeadById(id);

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;

  // MOCK DATA (UI preview only) — remove when integrating.
  const lead = getMockLeadById(id);

  if (!lead) {
    notFound();
  }

  return <LeadDetailView lead={lead} />;
}
