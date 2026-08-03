import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import {
  DASHBOARD_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/dashboard-constants";
import type { DashboardUserRole } from "@/lib/dashboard-users/types";
import { isDashboardUserRole } from "@/lib/dashboard-users/profile";
import { getProfileById } from "@/lib/dashboard-users/storage";

export {
  DASHBOARD_SESSION_COOKIE,
  DASHBOARD_PATH,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/dashboard-constants";

export type DashboardSessionPayload = {
  id: string;
  email: string;
  role: DashboardUserRole;
};

function getSessionSecret() {
  return (
    process.env.DASHBOARD_SESSION_SECRET ||
    "take-bring-dashboard-dev-secret"
  );
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
}

/** Session format: id|email|role|issuedAt|signature */
export function createDashboardSessionToken(user: DashboardSessionPayload) {
  const issuedAt = Date.now().toString();
  const payload = `${user.id}|${user.email}|${user.role}|${issuedAt}`;
  return `${payload}|${signPayload(payload)}`;
}

export function parseDashboardSessionToken(
  token: string | undefined,
): DashboardSessionPayload | null {
  if (!token) return null;

  const parts = token.split("|");
  if (parts.length !== 5) return null;

  const [id, email, role, issuedAt, signature] = parts;
  if (!id || !email || !role || !issuedAt || !signature) return null;
  if (!isDashboardUserRole(role)) return null;

  const expected = signPayload(`${id}|${email}|${role}|${issuedAt}`);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  const ageMs = Date.now() - Number(issuedAt);
  if (
    !Number.isFinite(ageMs) ||
    ageMs < 0 ||
    ageMs > SESSION_MAX_AGE_SECONDS * 1000
  ) {
    return null;
  }

  return { id, email, role };
}

export function verifyDashboardSessionToken(token: string | undefined) {
  return parseDashboardSessionToken(token) !== null;
}

export function getEmailFromDashboardSessionToken(token: string | undefined) {
  return parseDashboardSessionToken(token)?.email ?? null;
}

export async function getDashboardUser() {
  const jar = await cookies();
  const token = jar.get(DASHBOARD_SESSION_COOKIE)?.value;
  const session = parseDashboardSessionToken(token);
  if (!session) return null;

  // Refresh name from profile when available
  try {
    const profile = await getProfileById(session.id);
    if (profile) {
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
      };
    }
  } catch {
    // fall through to session-only user
  }

  return {
    id: session.id,
    email: session.email,
    name: session.email,
    role: session.role,
  };
}

export async function isDashboardAuthenticated() {
  const user = await getDashboardUser();
  return user !== null;
}

export async function requireDashboardUser() {
  const user = await getDashboardUser();
  if (!user) {
    return { ok: false as const, status: 401 as const, error: "Unauthorized." };
  }
  return { ok: true as const, user };
}

export async function requireDashboardRole(
  ...allowed: DashboardUserRole[]
) {
  const auth = await requireDashboardUser();
  if (!auth.ok) return auth;

  if (!allowed.includes(auth.user.role)) {
    return {
      ok: false as const,
      status: 403 as const,
      error: "Forbidden. Admin role required.",
    };
  }

  return auth;
}

/** @deprecated Env login removed — use authenticateDashboardUser via login API. */
export function validateDashboardCredentials(_email: string, _password: string) {
  return { ok: false as const, error: "not_configured" as const };
}
