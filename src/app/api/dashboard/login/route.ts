import { NextResponse } from "next/server";
import {
  DASHBOARD_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createDashboardSessionToken,
  validateDashboardCredentials,
} from "@/lib/dashboard-auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Email and password are required." },
      { status: 400 },
    );
  }

  const result = validateDashboardCredentials(email, password);

  if (!result.ok) {
    if (result.error === "not_configured") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Dashboard login is not configured. Set DASHBOARD_EMAIL and DASHBOARD_PASSWORD.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: DASHBOARD_SESSION_COOKIE,
    value: createDashboardSessionToken(email.trim().toLowerCase()),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
