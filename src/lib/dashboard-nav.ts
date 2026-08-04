import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  canAccessNav,
  type DashboardNavId,
} from "@/lib/dashboard-permissions";
import type { DashboardUserRole } from "@/lib/dashboard-users/types";

export type DashboardNavItem = {
  id: DashboardNavId;
  label: string;
  href: string;
  icon: LucideIcon;
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/tb-dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    id: "website-analytics",
    label: "Website-Analytics",
    href: "/tb-dashboard/website-analytics",
    icon: BarChart3,
  },
  {
    id: "blogs",
    label: "Blogs",
    href: "/tb-dashboard/blogs",
    icon: FileText,
  },
  {
    id: "leads",
    label: "Leads",
    href: "/tb-dashboard/leads",
    icon: UserCircle,
  },
  {
    id: "users",
    label: "Users",
    href: "/tb-dashboard/users",
    icon: Users,
  },
];

export function getNavItemsForRole(
  role: DashboardUserRole | string | undefined,
) {
  return dashboardNavItems.filter((item) => canAccessNav(role, item.id));
}

export const dashboardLogoutItem = {
  id: "logout",
  label: "Logout",
  icon: LogOut,
} as const;

export function getDashboardPageTitle(pathname: string) {
  const match = dashboardNavItems.find(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return match?.label ?? "Dashboard";
}

export function getUserDisplayName(email: string) {
  const localPart = email.split("@")[0] ?? "User";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
