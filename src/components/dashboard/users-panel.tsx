"use client";

import { useMemo, useState } from "react";
import { Info, Plus } from "lucide-react";
import { CreateUserModal } from "@/components/dashboard/create-user-modal";
import { UsersDataGrid } from "@/components/dashboard/users-table";
import { useToast } from "@/components/shared/toast";
import { countUsersByRole, isDuplicateUserEmail } from "@/lib/dashboard-users/helpers";
import type {
  CreateDashboardUserInput,
  DashboardUser,
} from "@/lib/dashboard-users/types";

type UsersPanelProps = {
  initialUsers: DashboardUser[];
};

export function UsersPanel({ initialUsers }: UsersPanelProps) {
  const { showToast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);

  const roleCounts = useMemo(() => countUsersByRole(users), [users]);

  function handleCreate(input: CreateDashboardUserInput): boolean {
    if (isDuplicateUserEmail(users, input.email)) {
      showToast("A user with this email already exists.");
      return false;
    }

    // TODO(integrate): POST to users API instead of local mock append.
    const next: DashboardUser = {
      id: `mock-user-${Date.now()}`,
      name: input.name,
      email: input.email,
      role: input.role,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [next, ...prev]);
    showToast("User added to preview list (login not enabled yet).");
    return true;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-logo-bg/50">
            Access
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-logo-bg sm:text-2xl">
            Users
          </h2>
          <p className="mt-1 text-sm text-foreground/55">
            Manage dashboard accounts and roles. Uses mock data until backend
            auth integration is complete.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-logo-bg px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Create user
        </button>
      </div>

      <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>
          <strong>Preview mode:</strong> users created here are stored in this
          browser session only. They cannot log in until the Users backend +
          integration tickets are completed.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total users" value={String(users.length)} />
        <MetricCard label="Admins" value={String(roleCounts.Admin ?? 0)} />
        <MetricCard
          label="Content managers"
          value={String(roleCounts["Content Manager"] ?? 0)}
        />
        <MetricCard label="Viewers" value={String(roleCounts.Viewer ?? 0)} />
      </div>

      <UsersDataGrid users={users} onCreateClick={() => setModalOpen(true)} />

      <CreateUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-logo-bg">{value}</p>
    </div>
  );
}
