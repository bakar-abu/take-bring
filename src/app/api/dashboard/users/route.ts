import { NextResponse } from "next/server";
import { requireDashboardRole } from "@/lib/dashboard-auth";
import { createUser, listUsers } from "@/lib/dashboard-users/storage";
import {
  DASHBOARD_USER_ROLES,
  type CreateDashboardUserInput,
  type DashboardUserRole,
} from "@/lib/dashboard-users/types";
import { isSmtpConfigured, sendDashboardUserInviteEmail } from "@/lib/mail";
import { siteConfig } from "@/config/site";

function buildLoginUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return `${configured}/tb-dashboard`;
  try {
    return new URL("/tb-dashboard", request.url).toString();
  } catch {
    return `${siteConfig.url}/tb-dashboard`;
  }
}

export async function GET() {
  const auth = await requireDashboardRole("Admin");
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  try {
    const users = await listUsers();
    return NextResponse.json({ ok: true, users });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not list users.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireDashboardRole("Admin");
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  let body: Partial<CreateDashboardUserInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const name = typeof body.name === "string" ? body.name : "";
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = body.role as DashboardUserRole | undefined;

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { ok: false, error: "Name, email, password, and role are required." },
      { status: 400 },
    );
  }

  if (!(DASHBOARD_USER_ROLES as readonly string[]).includes(role)) {
    return NextResponse.json(
      { ok: false, error: "Invalid role." },
      { status: 400 },
    );
  }

  try {
    const user = await createUser({ name, email, password, role });

    let emailSent = false;
    let emailError: string | null = null;
    if (isSmtpConfigured()) {
      try {
        await sendDashboardUserInviteEmail({
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
          loginUrl: buildLoginUrl(request),
        });
        emailSent = true;
      } catch (err) {
        emailError =
          err instanceof Error ? err.message : "Could not send invite email.";
      }
    } else {
      emailError = "SMTP is not configured; invite email was not sent.";
    }

    return NextResponse.json(
      { ok: true, user, emailSent, emailError },
      { status: 201 },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not create user.";
    const status = /already exists/i.test(message) ? 409 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
