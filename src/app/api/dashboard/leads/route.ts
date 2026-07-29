import { NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/dashboard-auth";
import { listLeads } from "@/lib/leads/storage";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const leads = await listLeads();
  return NextResponse.json({ ok: true, leads });
}
