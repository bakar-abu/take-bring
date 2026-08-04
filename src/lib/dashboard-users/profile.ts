import type { DashboardUserRole } from "@/lib/dashboard-users/types";
import { DASHBOARD_USER_ROLES } from "@/lib/dashboard-users/types";

export type UserRow = {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  role: DashboardUserRole;
  created_at: string;
  updated_at: string;
};

export function isDashboardUserRole(value: string): value is DashboardUserRole {
  return (DASHBOARD_USER_ROLES as readonly string[]).includes(value);
}

export function mapUserRowToDashboardUser(row: Omit<UserRow, "password_hash">) {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
  };
}
