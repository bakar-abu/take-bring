import { redirect } from "next/navigation";
import { getDashboardUser } from "@/lib/dashboard-auth";
import { DASHBOARD_PATH } from "@/lib/dashboard-constants";
import {
  canAccessNav,
  type DashboardNavId,
} from "@/lib/dashboard-permissions";

/** Server-side guard for dashboard section pages. */
export async function requireNavAccess(navId: DashboardNavId) {
  const user = await getDashboardUser();
  if (!user) redirect(DASHBOARD_PATH);
  if (!canAccessNav(user.role, navId)) {
    redirect("/tb-dashboard/overview");
  }
  return user;
}
