import Link from "next/link";

export default function LeadNotFound() {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-extrabold text-logo-bg">Lead not found</h2>
      <p className="mt-2 text-sm text-foreground/55">
        This lead may have been removed or the link is invalid.
      </p>
      <Link
        href="/tb-dashboard/leads"
        className="mt-6 inline-flex rounded-lg bg-logo-bg px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
      >
        Back to leads
      </Link>
    </div>
  );
}
