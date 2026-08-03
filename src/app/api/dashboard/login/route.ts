import { NextResponse } from "next/server";
import {
  DASHBOARD_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createDashboardSessionToken,
} from "@/lib/dashboard-auth";
import { authenticateDashboardUser } from "@/lib/dashboard-users/storage";

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

  let user;
  try {
    user = await authenticateDashboardUser(email, password);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Login service unavailable.";
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });

  response.cookies.set({
    name: DASHBOARD_SESSION_COOKIE,
    value: createDashboardSessionToken({
      id: user.id,
      email: user.email,
      role: user.role,
    }),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
