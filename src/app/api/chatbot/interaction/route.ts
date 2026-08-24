import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/leads/storage";
import { normalizeChatbotLocale } from "@/config/chatbot-knowledge";

const interactionLog = new Map<string, number[]>();

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (interactionLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < 10 * 60_000,
  );
  recent.push(now);
  interactionLog.set(key, recent);
  return recent.length > 10;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const sessionId = clean(body.sessionId, 100);
    const interactionType = clean(body.interactionType, 30);
    const locale = normalizeChatbotLocale(body.locale);
    const pagePath = clean(body.pagePath, 300);
    const latestMessage = clean(body.latestMessage, 1_000);
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!["whatsapp_click", "phone_click"].includes(interactionType)) {
      return NextResponse.json(
        { error: "Invalid interaction type." },
        { status: 400 },
      );
    }
    if (isRateLimited(`${ip}:${sessionId || "anonymous"}`)) {
      return NextResponse.json({ success: true });
    }

    const channel =
      interactionType === "whatsapp_click" ? "WhatsApp" : "Phone";

    await createLead({
      type: "contact",
      formKey: interactionType,
      sourcePage: pagePath || "/chatbot",
      fullName: "Chatbot visitor",
      email: "chatbot-interaction@take-bring.eu",
      inquiryType: `${channel} click`,
      message: [
        `Visitor clicked ${channel} from the website chatbot.`,
        latestMessage ? `Latest message: ${latestMessage}` : "",
        `Locale: ${locale}`,
        sessionId ? `Session: ${sessionId}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Interaction tracking must never block WhatsApp or phone navigation.
    console.error("Unable to record chatbot interaction", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
