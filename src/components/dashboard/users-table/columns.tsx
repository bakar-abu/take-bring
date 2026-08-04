"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Power, Trash2 } from "lucide-react";
import { userRoleBadgeClass } from "@/lib/dashboard-users/helpers";
import {
  DASHBOARD_USER_ROLES,
  type DashboardUser,
  type DashboardUserRole,
} from "@/lib/dashboard-users/types";

export const USER_ROLE_FILTERS: Array<{
  id: "all" | DashboardUserRole;
  label: string;
}> = [
  { id: "all", label: "All" },
  ...DASHBOARD_USER_ROLES.map((role) => ({ id: role, label: role })),
];

export function formatUserDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Headless column definitions for dashboard users.
 */
export function createUsersColumns(options?: {
  onEditUser?: (user: DashboardUser) => void;
  onDeleteUser?: (user: DashboardUser) => void;
  onToggleActive?: (user: DashboardUser) => void;
  busyUserId?: string | null;
}): ColumnDef<DashboardUser>[] {
  return [
    {
      id: "select",
      enableSorting: false,
      enableHiding: false,
      header: ({ table }) => (
        <input
          type="checkbox"
          aria-label="Select all rows"
          className="h-4 w-4 rounded border-black/30 bg-transparent accent-primary"
          checked={table.getIsAllPageRowsSelected()}
          ref={(el) => {
            if (el) {
              el.indeterminate = table.getIsSomePageRowsSelected();
            }
          }}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          onClick={(event) => event.stopPropagation()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          aria-label={`Select ${row.original.name}`}
          className="h-4 w-4 rounded border-black/30 bg-transparent accent-primary"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(event) => event.stopPropagation()}
        />
      ),
    },
    {
      accessorKey: "name",
      id: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-extrabold text-logo-bg"
            aria-hidden
          >
            {getInitials(row.original.name)}
          </span>
          <span className="truncate font-semibold text-logo-bg">
            {row.original.name}
          </span>
        </div>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "email",
      id: "email",
      header: "Email",
      cell: ({ row }) => (
        <span
          className="block truncate text-foreground/80"
          title={row.original.email}
        >
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "role",
      id: "role",
      header: "Role",
      cell: ({ getValue }) => {
        const role = getValue<DashboardUserRole>();
        return (
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${userRoleBadgeClass(role)}`}
          >
            {role}
          </span>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        return row.getValue(columnId) === filterValue;
      },
    },
    {
      accessorKey: "isActive",
      id: "isActive",
      header: "Status",
      cell: ({ row }) =>
        row.original.isActive ? (
          <span className="inline-flex rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
            Active
          </span>
        ) : (
          <span className="inline-flex rounded-md bg-black/5 px-2 py-0.5 text-xs font-semibold text-logo-bg/55">
            Inactive
          </span>
        ),
    },
    {
      accessorKey: "createdAt",
      id: "createdAt",
      header: "Created",
      cell: ({ getValue }) => (
        <span className="block truncate text-foreground/60">
          {formatUserDate(getValue<string>())}
        </span>
      ),
      sortingFn: "datetime",
    },
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              options?.onEditUser?.(row.original);
            }}
            disabled={options?.busyUserId === row.original.id}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-black/10 px-2 py-1 text-[11px] font-semibold text-logo-bg/80 transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Pencil className="h-3 w-3" aria-hidden />
            Edit
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              options?.onToggleActive?.(row.original);
            }}
            disabled={options?.busyUserId === row.original.id}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-black/10 px-2 py-1 text-[11px] font-semibold text-logo-bg/80 transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Power className="h-3 w-3" aria-hidden />
            {row.original.isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              options?.onDeleteUser?.(row.original);
            }}
            disabled={options?.busyUserId === row.original.id}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Trash2 className="h-3 w-3" aria-hidden />
            {options?.busyUserId === row.original.id ? "Working..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];
}
