import { Suspense } from "react";
import { LeadsDataGrid } from "@/components/dashboard/leads-table";
import { MOCK_LEADS } from "@/lib/leads/mock-leads";
import type { LeadListItem } from "@/lib/leads/types";

// TODO(integrate): When wiring real data, delete `src/lib/leads/mock-leads.ts`,
// remove MOCK_LEADS below, and use:
//   import { listLeads } from "@/lib/leads/storage";
//   const leads = await listLeads();

function toListItem(lead: (typeof MOCK_LEADS)[number]): LeadListItem {
  return {
    id: lead.id,
    createdAt: lead.createdAt,
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    pickupAddress: lead.pickupAddress,
    deliveryAddress: lead.deliveryAddress,
    sourceLabel: lead.sourceLabel,
    sourcePage: lead.sourcePage,
    type: lead.type,
    formKey: lead.formKey,
  };
}

export default async function LeadsPage() {
  // MOCK DATA (UI preview only) — remove when integrating.
  const leads = MOCK_LEADS.map(toListItem);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-logo-bg/50">
          Inbox
        </p>
        <h2 className="mt-1 text-xl font-extrabold text-logo-bg sm:text-2xl">
          All website leads
        </h2>
        <p className="mt-1 text-sm text-foreground/55">
          Unified view of contact, service, calculator, and newsletter
          submissions.
        </p>
      </div>

      {/*
        stateMode="local" → React owns table state (default).
        stateMode="url" → syncs q/type/sort/page to the URL for shareable/server state.
      */}
      <Suspense
        fallback={
          <div className="rounded-2xl border border-black/10 p-8 text-sm text-foreground/60">
            Loading leads table…
          </div>
        }
      >
        <LeadsDataGrid leads={leads} stateMode="local" />
      </Suspense>
    </div>
  );
}
