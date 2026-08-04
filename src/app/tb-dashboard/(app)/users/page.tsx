import { UsersPanel } from "@/components/dashboard/users-panel";
import { requireNavAccess } from "@/lib/dashboard-require-nav";
import { listUsers } from "@/lib/dashboard-users/storage";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireNavAccess("users");

  let users: Awaited<ReturnType<typeof listUsers>> = [];
  try {
    users = await listUsers();
  } catch {
    users = [];
  }

  return <UsersPanel initialUsers={users} />;
}
