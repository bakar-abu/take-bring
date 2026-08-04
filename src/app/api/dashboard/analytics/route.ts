import { NextResponse } from "next/server";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { getAnalyticsSnapshot } from "@/lib/dashboard-analytics/snapshot";
import type { AnalyticsPeriod } from "@/lib/dashboard-analytics/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireDashboardUser();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  const { searchParams } = new URL(request.url);
  const periodParam = searchParams.get("period");
  const period: AnalyticsPeriod =
    periodParam === "7d" || periodParam === "30d" ? periodParam : "30d";

  try {
    const snapshot = await getAnalyticsSnapshot(period);
    return NextResponse.json({
      ok: true,
      snapshot,
      source: "live" as const,
    });
  } catch (err) {
    console.error("[api/dashboard/analytics]", err);
    const message =
      err instanceof Error ? err.message : "Could not load analytics.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
