import { NextResponse } from "next/server";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { listLeads } from "@/lib/leads/storage";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireDashboardUser();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  try {
    const leads = await listLeads();
    return NextResponse.json({ ok: true, leads });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not list leads.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
