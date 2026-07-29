"use client";

import type { ColumnDef } from "@tanstack/react-table";
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

export function userRoleBadgeClass(role: DashboardUserRole) {
  switch (role) {
    case "Admin":
      return "text-emerald-700 ring-1 ring-emerald-600/30";
    case "Content Manager":
      return "text-amber-700 ring-1 ring-amber-600/30";
    case "Viewer":
      return "text-sky-700 ring-1 ring-sky-600/30";
    default:
      return "text-logo-bg/70 ring-1 ring-black/15";
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
export function createUsersColumns(): ColumnDef<DashboardUser>[] {
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
        <span className="block truncate text-foreground/80" title={row.original.email}>
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
  ];
}
