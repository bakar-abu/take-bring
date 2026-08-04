import type { DashboardUserRole } from "@/lib/dashboard-users/types";

export type DashboardNavId =
  | "overview"
  | "website-analytics"
  | "blogs"
  | "leads"
  | "users";

/** Which sidebar items each role can see. */
const NAV_BY_ROLE: Record<DashboardUserRole, readonly DashboardNavId[]> = {
  Admin: ["overview", "website-analytics", "blogs", "leads", "users"],
  "Content Manager": ["overview", "website-analytics", "blogs", "leads"],
  Viewer: ["overview", "website-analytics", "leads"],
};

export function navIdsForRole(role: DashboardUserRole | string | undefined) {
  if (role === "Admin" || role === "Content Manager" || role === "Viewer") {
    return NAV_BY_ROLE[role];
  }
  return NAV_BY_ROLE.Viewer;
}

export function canAccessNav(
  role: DashboardUserRole | string | undefined,
  navId: DashboardNavId,
) {
  return navIdsForRole(role).includes(navId);
}

/** Path prefix → nav id for route guards */
export function navIdForPath(pathname: string): DashboardNavId | null {
  if (pathname.startsWith("/tb-dashboard/users")) return "users";
  if (pathname.startsWith("/tb-dashboard/blogs")) return "blogs";
  if (pathname.startsWith("/tb-dashboard/leads")) return "leads";
  if (pathname.startsWith("/tb-dashboard/website-analytics")) {
    return "website-analytics";
  }
  if (pathname.startsWith("/tb-dashboard/overview")) return "overview";
  return null;
}

export function canMutateLeads(role: DashboardUserRole | string | undefined) {
  return role === "Admin" || role === "Content Manager";
}

export function canManageUsers(role: DashboardUserRole | string | undefined) {
  return role === "Admin";
}

export function canWriteBlogs(role: DashboardUserRole | string | undefined) {
  return role === "Admin" || role === "Content Manager";
}
