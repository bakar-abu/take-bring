import { Suspense } from "react";
import { LeadsDataGrid } from "@/components/dashboard/leads-table";
import { listLeads } from "@/lib/leads/storage";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await listLeads();

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
          submissions. New form submissions appear here automatically.
        </p>
      </div>

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
