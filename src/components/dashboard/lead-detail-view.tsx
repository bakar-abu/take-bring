import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { displayLeadValue } from "@/lib/leads/helpers";
import type { Lead } from "@/lib/leads/types";

type LeadDetailViewProps = {
  lead: Lead;
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 border-b border-black/5 py-3.5 sm:grid-cols-[220px_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-logo-bg/70">{label}</dt>
      <dd className="whitespace-pre-wrap break-words text-sm text-logo-bg sm:text-[15px]">
        {displayLeadValue(value)}
      </dd>
    </div>
  );
}

export function LeadDetailView({ lead }: LeadDetailViewProps) {
  const dimensions =
    [lead.length, lead.width, lead.height].filter((v) => v.trim()).length > 0
      ? [lead.length, lead.width, lead.height]
          .map((v) => displayLeadValue(v))
          .join(" × ") + " cm"
      : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/tb-dashboard/leads"
          className="inline-flex items-center gap-2 text-sm font-semibold text-logo-bg/70 transition-colors hover:text-logo-bg"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to leads
        </Link>
        <p className="text-sm text-foreground/55">{formatDate(lead.createdAt)}</p>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-black/5 pb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-dark">
              Lead details
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-logo-bg">
              {displayLeadValue(lead.fullName)}
            </h2>
            <p className="mt-1 text-sm text-foreground/55">
              {displayLeadValue(lead.sourceLabel)}
            </p>
          </div>
          <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-logo-bg">
            {lead.type.replace("-", " ")}
          </span>
        </div>

        <dl>
          <DetailRow label="Customer name" value={lead.fullName} />
          <DetailRow label="Email" value={lead.email} />
          <DetailRow label="Phone" value={lead.phone} />
          <DetailRow label="WhatsApp" value={lead.whatsapp} />
          <DetailRow label="Inquiry type" value={lead.inquiryType} />
          <DetailRow label="Pickup address" value={lead.pickupAddress} />
          <DetailRow label="Delivery address" value={lead.deliveryAddress} />
          <DetailRow label="Length (cm)" value={lead.length} />
          <DetailRow label="Width (cm)" value={lead.width} />
          <DetailRow label="Height (cm)" value={lead.height} />
          <DetailRow label="Dimensions" value={dimensions} />
          <DetailRow label="Message" value={lead.message} />
          <DetailRow label="Source page" value={lead.sourcePage} />
          <DetailRow label="Source form" value={lead.sourceLabel} />
          <DetailRow label="Form key" value={lead.formKey} />
          <DetailRow label="Submitted at" value={formatDate(lead.createdAt)} />
          <DetailRow label="Lead ID" value={lead.id} />
        </dl>
      </div>
    </div>
  );
}
