import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import {
  DASHBOARD_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/dashboard-constants";

export {
  DASHBOARD_SESSION_COOKIE,
  DASHBOARD_PATH,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/dashboard-constants";

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

export function createDashboardSessionToken(email: string) {
  const issuedAt = Date.now().toString();
  const payload = `${email}|${issuedAt}`;
  return `${payload}|${signPayload(payload)}`;
}

export function verifyDashboardSessionToken(token: string | undefined) {
  if (!token) return false;

  const parts = token.split("|");
  if (parts.length !== 3) return false;

  const [email, issuedAt, signature] = parts;
  if (!email || !issuedAt || !signature) return false;

  const expected = signPayload(`${email}|${issuedAt}`);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }

  const ageMs = Date.now() - Number(issuedAt);
  if (
    !Number.isFinite(ageMs) ||
    ageMs < 0 ||
    ageMs > SESSION_MAX_AGE_SECONDS * 1000
  ) {
    return false;
  }

  return true;
}

export function getEmailFromDashboardSessionToken(token: string | undefined) {
  if (!verifyDashboardSessionToken(token)) return null;
  return token?.split("|")[0] ?? null;
}

export async function getDashboardUser() {
  const jar = await cookies();
  const token = jar.get(DASHBOARD_SESSION_COOKIE)?.value;
  const email = getEmailFromDashboardSessionToken(token);

  if (!email) return null;

  return { email };
}

export async function isDashboardAuthenticated() {
  const user = await getDashboardUser();
  return user !== null;
}

export function validateDashboardCredentials(email: string, password: string) {
  const expectedEmail = process.env.DASHBOARD_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.DASHBOARD_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return { ok: false as const, error: "not_configured" };
  }

  const emailOk = email.trim().toLowerCase() === expectedEmail;
  const passwordOk = password === expectedPassword;

  if (!emailOk || !passwordOk) {
    return { ok: false as const, error: "invalid_credentials" };
  }

  return { ok: true as const };
}
