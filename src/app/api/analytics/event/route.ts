import { NextResponse } from "next/server";
import { clientContextFromRequest } from "@/lib/dashboard-analytics/client-context";
import { insertAnalyticsEvent } from "@/lib/dashboard-analytics/storage";
import type { AnalyticsEventType } from "@/lib/dashboard-analytics/constants";

export const runtime = "nodejs";

const ALLOWED_TYPES: AnalyticsEventType[] = [
  "page_view",
  "cta_click",
  "consent",
];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const eventType = asString(body.eventType) as AnalyticsEventType;

    if (!ALLOWED_TYPES.includes(eventType)) {
      return NextResponse.json(
        { ok: false, error: "Invalid event type." },
        { status: 400 },
      );
    }

    if (eventType === "cta_click" && !asString(body.ctaId)) {
      return NextResponse.json(
        { ok: false, error: "ctaId is required for cta_click." },
        { status: 400 },
      );
    }

    if (eventType === "consent") {
      const consentValue = asString(body.consentValue);
      if (consentValue !== "accepted" && consentValue !== "rejected") {
        return NextResponse.json(
          { ok: false, error: "consentValue must be accepted or rejected." },
          { status: 400 },
        );
      }
    }

    const context = clientContextFromRequest(request);

    await insertAnalyticsEvent({
      eventType,
      path: asString(body.path) || "/",
      locale: asString(body.locale) || "ro",
      referrer: asString(body.referrer),
      ctaId: asString(body.ctaId),
      consentValue:
        asString(body.consentValue) === "accepted" ||
        asString(body.consentValue) === "rejected"
          ? (asString(body.consentValue) as "accepted" | "rejected")
          : "",
      sessionId: asString(body.sessionId),
      visitorId: asString(body.visitorId),
      country: context.country,
      device: context.device,
      browser: context.browser,
      os: context.os,
      meta:
        body.meta && typeof body.meta === "object"
          ? (body.meta as Record<string, unknown>)
          : {},
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/analytics/event]", error);
    return NextResponse.json(
      { ok: false, error: "Could not record event." },
      { status: 500 },
    );
  }
}
