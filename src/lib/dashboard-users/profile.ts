import type { DashboardUserRole } from "@/lib/dashboard-users/types";
import { DASHBOARD_USER_ROLES } from "@/lib/dashboard-users/types";

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  role: DashboardUserRole;
  created_at: string;
  updated_at: string;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: DashboardUserRole;
};

export function isDashboardUserRole(value: string): value is DashboardUserRole {
  return (DASHBOARD_USER_ROLES as readonly string[]).includes(value);
}

export function mapProfileToDashboardUser(row: ProfileRow) {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
  };
}
