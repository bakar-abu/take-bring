import { UsersPanel } from "@/components/dashboard/users-panel";
import { listUsers } from "@/lib/dashboard-users/storage";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let users: Awaited<ReturnType<typeof listUsers>> = [];
  try {
    users = await listUsers();
  } catch {
    users = [];
  }

  return <UsersPanel initialUsers={users} />;
}
