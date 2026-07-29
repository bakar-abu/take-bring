import { UsersPanel } from "@/components/dashboard/users-panel";
import { MOCK_USERS } from "@/lib/dashboard-users/mock-users";

// TODO(integrate): When wiring real data, delete `src/lib/dashboard-users/mock-users.ts`,
// remove MOCK_USERS below, and fetch users from your API/storage instead.

export default function UsersPage() {
  // MOCK DATA (UI preview only) — remove when integrating.
  const users = MOCK_USERS;

  return <UsersPanel initialUsers={users} />;
}
