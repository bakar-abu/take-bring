import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/leads/storage";
import { isSmtpConfigured, sendContactLeadEmails } from "@/lib/mail";
import { normalizeChatbotLocale } from "@/config/chatbot-knowledge";

type TranscriptMessage = {
  role: "user" | "assistant";
  content: string;
};

const submissions = new Map<string, number[]>();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < 10 * 60_000,
  );
  recent.push(now);
  submissions.set(ip, recent);
  return recent.length > 5;
}

function formatTranscript(transcript: TranscriptMessage[]) {
  if (!transcript.length) return "";
  return [
    "",
    "--- Chat transcript ---",
    ...transcript.map(
      (item) => `${item.role === "user" ? "Visitor" : "Assistant"}: ${item.content}`,
    ),
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;

    // Honeypot field: real visitors never see or fill it.
    if (clean(body.companyWebsite, 200)) {
      return NextResponse.json({ success: true });
    }

    const fullName = clean(body.fullName, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 50);
    const pickup = clean(body.pickup, 160);
    const delivery = clean(body.delivery, 160);
    const message = clean(body.message, 1_500);
    const pagePath = clean(body.pagePath, 300);
    const sessionId = clean(body.sessionId, 100);
    const locale = normalizeChatbotLocale(body.locale);
    const transcript = Array.isArray(body.transcript)
      ? body.transcript
          .filter(
            (item): item is TranscriptMessage =>
              Boolean(item) &&
              typeof item === "object" &&
              ((item as TranscriptMessage).role === "user" ||
                (item as TranscriptMessage).role === "assistant") &&
              typeof (item as TranscriptMessage).content === "string",
          )
          .slice(-20)
          .map((item) => ({
            role: item.role,
            content: item.content.trim().slice(0, 1_000),
          }))
      : [];

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 },
      );
    }
    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const messageWithMeta = [
      message || "Chatbot quote request",
      "",
      `Locale: ${locale}`,
      sessionId ? `Session: ${sessionId}` : "",
      formatTranscript(transcript),
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, 8_000);

    await createLead({
      type: "contact",
      formKey: "chatbot_lead",
      sourcePage: pagePath || "/chatbot",
      fullName,
      email,
      phone,
      whatsapp: phone,
      inquiryType: "Chatbot inquiry",
      message: messageWithMeta,
      pickupAddress: pickup,
      deliveryAddress: delivery,
    });

    if (isSmtpConfigured()) {
      void sendContactLeadEmails({
        formKey: "chatbot_lead",
        fullName,
        email,
        phone,
        inquiryType: "Chatbot inquiry",
        message: [
          message || "-",
          pickup ? `Pickup: ${pickup}` : "",
          delivery ? `Delivery: ${delivery}` : "",
          pagePath ? `Page: ${pagePath}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      }).catch((error) => {
        console.error("Unable to send chatbot lead notification", error);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unable to create chatbot lead", error);
    return NextResponse.json(
      { error: "Unable to save your request. Please use WhatsApp or call us." },
      { status: 500 },
    );
  }
}
