import type { DashboardUser, DashboardUserRole } from "@/lib/dashboard-users/types";

export function userRoleBadgeClass(role: DashboardUserRole) {
  switch (role) {
    case "Admin":
      return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20";
    case "Content Manager":
      return "bg-amber-100 text-amber-800 ring-1 ring-amber-600/20";
    case "Viewer":
      return "bg-sky-100 text-sky-800 ring-1 ring-sky-600/20";
    default:
      return "bg-black/[0.04] text-logo-bg/70 ring-1 ring-black/15";
  }
}

export function countUsersByRole(users: DashboardUser[]) {
  return users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] ?? 0) + 1;
      return acc;
    },
    {} as Record<DashboardUserRole, number>,
  );
}

export function isDuplicateUserEmail(users: DashboardUser[], email: string) {
  const normalized = email.trim().toLowerCase();
  return users.some((user) => user.email.toLowerCase() === normalized);
}
