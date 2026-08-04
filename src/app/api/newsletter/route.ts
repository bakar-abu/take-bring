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

    let emailSent = false;
    let emailError: string | null = null;
    if (isSmtpConfigured()) {
      try {
        await sendNewsletterEmails(email);
        emailSent = true;
      } catch (err) {
        emailError =
          err instanceof Error ? err.message : "Could not send email.";
        console.error("[api/newsletter] email failed", err);
      }
    } else {
      emailError = "SMTP is not configured; lead saved without email.";
    }

    return NextResponse.json({ ok: true, emailSent, emailError });
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
