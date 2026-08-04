"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useToast } from "@/components/shared/toast";
import type { Lead, LeadStatus } from "@/lib/leads/types";
import { LEAD_STATUSES } from "@/lib/leads/types";

function statusBadgeClass(status: LeadStatus) {
  switch (status) {
    case "NEW":
      return "bg-amber-100 text-amber-800 ring-1 ring-amber-600/20";
    case "READ":
      return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20";
    case "ARCHIVED":
      return "bg-black/5 text-logo-bg/70 ring-1 ring-black/10";
    default:
      return "bg-black/5 text-logo-bg/70";
  }
}

export function LeadDetailActions({
  lead,
  readOnly = false,
}: {
  lead: Lead;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [statusPending, setStatusPending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  if (readOnly) {
    return (
      <span
        className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusBadgeClass(status)}`}
      >
        {status}
      </span>
    );
  }

  async function handleStatusChange(next: LeadStatus) {
    if (statusPending || next === status) return;
    setStatusPending(true);
    try {
      const response = await fetch(`/api/dashboard/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        lead?: Lead;
      };
      if (!response.ok || !data.ok || !data.lead) {
        showToast(data.error || "Could not update status.");
        return;
      }
      setStatus(data.lead.status);
      showToast("Lead status updated.");
      router.refresh();
    } catch {
      showToast("Could not update status.");
    } finally {
      setStatusPending(false);
    }
  }

  async function handleDelete() {
    if (deletePending) return;
    setDeletePending(true);
    try {
      const response = await fetch(`/api/dashboard/leads/${lead.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        showToast(data.error || "Could not delete lead.");
        return;
      }
      showToast("Lead deleted.");
      router.push("/tb-dashboard/leads");
      router.refresh();
    } catch {
      showToast("Could not delete lead.");
    } finally {
      setDeletePending(false);
      setDeleteOpen(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusBadgeClass(status)}`}
        >
          {status}
        </span>
        <select
          value={status}
          disabled={statusPending || deletePending}
          onChange={(e) => void handleStatusChange(e.target.value as LeadStatus)}
          className="cursor-pointer rounded-lg border border-black/15 px-3 py-2 text-sm font-semibold text-logo-bg outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Change lead status"
        >
          {LEAD_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {statusPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-foreground/50" aria-hidden />
        ) : null}
        <button
          type="button"
          disabled={statusPending || deletePending}
          onClick={() => setDeleteOpen(true)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
          Delete
        </button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete lead?"
        description={`This permanently removes the lead from “${lead.fullName || lead.email}”.`}
        confirmLabel="Delete"
        pending={deletePending}
        onClose={() => {
          if (!deletePending) setDeleteOpen(false);
        }}
        onConfirm={() => void handleDelete()}
      />
    </>
  );
}
