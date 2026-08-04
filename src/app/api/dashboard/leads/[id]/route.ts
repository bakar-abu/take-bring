import { NextResponse } from "next/server";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import {
  deleteLead,
  getLeadById,
  updateLeadStatus,
} from "@/lib/leads/storage";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/leads/types";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireDashboardUser();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  const { id } = await context.params;
  try {
    const lead = await getLeadById(id);
    if (!lead) {
      return NextResponse.json(
        { ok: false, error: "Lead not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not load lead.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireDashboardUser();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  const { id } = await context.params;
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const status = body.status as LeadStatus | undefined;
  if (!status || !(LEAD_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json(
      { ok: false, error: "status must be NEW, READ, or ARCHIVED." },
      { status: 400 },
    );
  }

  try {
    const lead = await updateLeadStatus(id, status);
    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not update lead.";
    const code = /not found|0 rows/i.test(message) ? 404 : 500;
    return NextResponse.json({ ok: false, error: message }, { status: code });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireDashboardUser();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  const { id } = await context.params;
  try {
    const existing = await getLeadById(id);
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Lead not found." },
        { status: 404 },
      );
    }
    await deleteLead(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not delete lead.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
