import { NextResponse } from "next/server";
import { requireDashboardRole } from "@/lib/dashboard-auth";
import {
  deleteUser,
  getUserById,
  updateUser,
} from "@/lib/dashboard-users/storage";
import {
  DASHBOARD_USER_ROLES,
  type DashboardUserRole,
} from "@/lib/dashboard-users/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireDashboardRole("Admin");
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  const { id } = await context.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not load user.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireDashboardRole("Admin");
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  const { id } = await context.params;
  let body: { name?: string; role?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  if (
    body.role !== undefined &&
    !(DASHBOARD_USER_ROLES as readonly string[]).includes(body.role)
  ) {
    return NextResponse.json(
      { ok: false, error: "Invalid role." },
      { status: 400 },
    );
  }

  try {
    const user = await updateUser(id, {
      name: body.name,
      role: body.role as DashboardUserRole | undefined,
      password: body.password,
    });
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not update user.";
    const status = /not found/i.test(message) ? 404 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireDashboardRole("Admin");
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  const { id } = await context.params;

  if (auth.user.id === id) {
    return NextResponse.json(
      { ok: false, error: "You cannot delete your own account." },
      { status: 400 },
    );
  }

  try {
    await deleteUser(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not delete user.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
