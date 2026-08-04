"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { CreateUserModal } from "@/components/dashboard/create-user-modal";
import { UsersDataGrid } from "@/components/dashboard/users-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useToast } from "@/components/shared/toast";
import { countUsersByRole } from "@/lib/dashboard-users/helpers";
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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<DashboardUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<DashboardUser | null>(null);
  const [createPending, setCreatePending] = useState(false);
  const [updatePending, setUpdatePending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [togglePendingId, setTogglePendingId] = useState<string | null>(null);

  const roleCounts = useMemo(() => countUsersByRole(users), [users]);

  async function handleCreate(input: CreateDashboardUserInput): Promise<boolean> {
    if (createPending) return false;
    setCreatePending(true);
    try {
      const response = await fetch("/api/dashboard/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        user?: DashboardUser;
        emailSent?: boolean;
        emailError?: string | null;
      };

      if (!response.ok || !data.ok || !data.user) {
        showToast(data.error || "Could not create user.");
        return false;
      }

      setUsers((prev) => [data.user!, ...prev]);
      if (data.emailSent) {
        showToast("User created. Login details emailed.");
      } else {
        showToast(
          data.emailError
            ? `User created. Email not sent: ${data.emailError}`
            : "User created.",
        );
      }
      return true;
    } catch {
      showToast("Could not create user.");
      return false;
    } finally {
      setCreatePending(false);
    }
  }

  async function handleEdit(input: CreateDashboardUserInput): Promise<boolean> {
    if (!editUser || updatePending) return false;
    setUpdatePending(true);

    try {
      const response = await fetch(`/api/dashboard/users/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        user?: DashboardUser;
      };
      if (!response.ok || !data.ok || !data.user) {
        showToast(data.error || "Could not update user.");
        return false;
      }
      setUsers((prev) =>
        prev.map((item) => (item.id === data.user!.id ? data.user! : item)),
      );
      showToast("User updated.");
      return true;
    } catch {
      showToast("Could not update user.");
      return false;
    } finally {
      setUpdatePending(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteUser || deletePending) return;
    setDeletePending(true);
    try {
      const response = await fetch(`/api/dashboard/users/${deleteUser.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        showToast(data.error || "Could not delete user.");
        return;
      }
      setUsers((prev) => prev.filter((item) => item.id !== deleteUser.id));
      setDeleteUser(null);
      showToast("User deleted.");
    } catch {
      showToast("Could not delete user.");
    } finally {
      setDeletePending(false);
    }
  }

  async function handleToggleActive(user: DashboardUser) {
    if (togglePendingId) return;
    setTogglePendingId(user.id);
    try {
      const response = await fetch(`/api/dashboard/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        user?: DashboardUser;
      };
      if (!response.ok || !data.ok || !data.user) {
        showToast(data.error || "Could not update user status.");
        return;
      }
      setUsers((prev) =>
        prev.map((item) => (item.id === data.user!.id ? data.user! : item)),
      );
      showToast(
        data.user.isActive ? "User activated." : "User deactivated.",
      );
    } catch {
      showToast("Could not update user status.");
    } finally {
      setTogglePendingId(null);
    }
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
            Manage dashboard accounts and roles. New users receive an email with
            their login email and password.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          disabled={createPending || updatePending || deletePending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-logo-bg px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {createPending ? "Creating..." : "Create user"}
        </button>
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

      <UsersDataGrid
        users={users}
        onEditUser={(user) => setEditUser(user)}
        onDeleteUser={(user) => setDeleteUser(user)}
        onToggleActive={(user) => void handleToggleActive(user)}
        busyUserId={
          togglePendingId ??
          (deletePending
            ? deleteUser?.id ?? null
            : updatePending
              ? editUser?.id ?? null
              : null)
        }
      />

      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        pending={createPending}
        mode="create"
        onSubmit={handleCreate}
      />
      <CreateUserModal
        open={editUser !== null}
        onClose={() => setEditUser(null)}
        pending={updatePending}
        mode="edit"
        submitLabel="Save changes"
        initialValues={
          editUser
            ? { name: editUser.name, email: editUser.email, role: editUser.role }
            : undefined
        }
        onSubmit={handleEdit}
      />
      <ConfirmDialog
        open={deleteUser !== null}
        title="Delete user?"
        description={
          deleteUser
            ? `Delete ${deleteUser.email}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete user"
        pending={deletePending}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground/45">
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold text-logo-bg">{value}</p>
    </div>
  );
}
