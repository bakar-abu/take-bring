import { BlogsManagementPanel } from "@/components/dashboard/blogs-management-panel";
import { requireNavAccess } from "@/lib/dashboard-require-nav";

export default async function BlogsPage() {
  await requireNavAccess("blogs");
  return <BlogsManagementPanel />;
}
