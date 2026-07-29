import { redirect } from "next/navigation";
import { DashboardLogin } from "@/components/dashboard/dashboard-login";
import { isDashboardAuthenticated } from "@/lib/dashboard-auth";

export default async function TbDashboardPage() {
  const authenticated = await isDashboardAuthenticated();

  if (authenticated) {
    redirect("/tb-dashboard/overview");
  }

  return <DashboardLogin />;
}
