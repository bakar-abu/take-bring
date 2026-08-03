import { NextResponse } from "next/server";
import { requireDashboardRole } from "@/lib/dashboard-auth";
import {
  createDashboardUser,
  listProfiles,
} from "@/lib/dashboard-users/storage";
import {
  DASHBOARD_USER_ROLES,
  type CreateDashboardUserInput,
  type DashboardUserRole,
} from "@/lib/dashboard-users/types";

export async function GET() {
  const auth = await requireDashboardRole("Admin");
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  try {
    const users = await listProfiles();
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
    const user = await createDashboardUser({ name, email, password, role });
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not create user.";
    const status = /already|exists|registered/i.test(message) ? 409 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
