import { NextResponse } from "next/server";
import { isSmtpConfigured, sendNewsletterEmails } from "@/lib/mail";
import { createLead } from "@/lib/leads/storage";

export const runtime = "nodejs";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    if (!isSmtpConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Email is not configured yet. Add SMTP_PASS in .env and restart the server.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    if (asString(body.website)) {
      return NextResponse.json({ ok: true });
    }

    const email = asString(body.email);
    const sourcePage = asString(body.sourcePage);

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    await createLead({
      type: "newsletter",
      formKey: "landing_newsletter_form",
      sourcePage,
      email,
      message: "Newsletter subscription",
      inquiryType: "Newsletter",
    });

    await sendNewsletterEmails(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/newsletter]", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Could not subscribe. Please try again later.",
      },
      { status: 500 },
    );
  }
}
