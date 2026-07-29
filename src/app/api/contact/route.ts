import { NextResponse } from "next/server";
import {
  isSmtpConfigured,
  sendContactLeadEmails,
  type ContactLeadPayload,
} from "@/lib/mail";
import { createLead } from "@/lib/leads/storage";
import { resolveLeadType } from "@/lib/leads/helpers";

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
            "Email is not configured yet. Add SMTP_PASS in .env.local and restart the server.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    if (asString(body.website)) {
      return NextResponse.json({ ok: true });
    }

    const formKey = asString(body.formKey) || "contact_form";
    const fullName = asString(body.fullName);
    const email = asString(body.email);
    const phone = asString(body.phone) || asString(body.whatsapp);
    const whatsapp = asString(body.whatsapp) || phone;
    const inquiryType = asString(body.inquiryType);
    const message = asString(body.message);
    const sourcePage = asString(body.sourcePage);
    const pickupAddress = asString(body.pickupAddress) || asString(body.pickUp);
    const deliveryAddress =
      asString(body.deliveryAddress) || asString(body.delivery);
    const length = asString(body.length);
    const width = asString(body.width);
    const height = asString(body.height);

    const payload: ContactLeadPayload = {
      formKey,
      fullName,
      email,
      phone,
      inquiryType: inquiryType || undefined,
      message,
    };

    if (
      !payload.fullName ||
      !payload.email ||
      !payload.phone ||
      !payload.message
    ) {
      return NextResponse.json(
        { ok: false, error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    await createLead({
      type: resolveLeadType(formKey),
      formKey,
      sourcePage,
      fullName,
      email,
      phone,
      whatsapp,
      inquiryType,
      message,
      pickupAddress,
      deliveryAddress,
      length,
      width,
      height,
    });

    await sendContactLeadEmails(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/contact]", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Could not send your message. Please try again later.",
      },
      { status: 500 },
    );
  }
}
