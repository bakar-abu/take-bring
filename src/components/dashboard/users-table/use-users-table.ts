"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
  type VisibilityState,
} from "@tanstack/react-table";
import { createUsersColumns } from "@/components/dashboard/users-table/columns";
import type {
  DashboardUser,
  DashboardUserRole,
} from "@/lib/dashboard-users/types";

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === "function"
    ? (updater as (old: T) => T)(previous)
    : updater;
}

type UseUsersTableOptions = {
  data: DashboardUser[];
  pageSize?: number;
  onEditUser?: (user: DashboardUser) => void;
  onDeleteUser?: (user: DashboardUser) => void;
  onToggleActive?: (user: DashboardUser) => void;
  busyUserId?: string | null;
};

/**
 * Headless TanStack Table controller for users.
 */
export function useUsersTable({
  data,
  pageSize = 8,
  onEditUser,
  onDeleteUser,
  onToggleActive,
  busyUserId,
}: UseUsersTableOptions) {
  const columns = useMemo(
    () =>
      createUsersColumns({
        onEditUser,
        onDeleteUser,
        onToggleActive,
        busyUserId,
      }),
    [onDeleteUser, onEditUser, onToggleActive, busyUserId],
  );

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [roleQuickFilter, setRoleQuickFilter] = useState<
    "all" | DashboardUserRole
  >("all");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: (updater) => {
      const next = String(resolveUpdater(updater, globalFilter) ?? "");
      setGlobalFilter(next);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue ?? "").toLowerCase().trim();
      if (!q) return true;
      const haystack = [row.original.name, row.original.email, row.original.role]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    },
  });

  const onRoleQuickFilterChange = (value: "all" | DashboardUserRole) => {
    setRoleQuickFilter(value);
    setColumnFilters(value === "all" ? [] : [{ id: "role", value }]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const selectedCount = Object.keys(rowSelection).filter(
    (key) => rowSelection[key],
  ).length;

  const sortedSummary = sorting[0]
    ? `${sorting[0].id} ${sorting[0].desc ? "desc" : "asc"}`
    : "none";

  const filteredSummary =
    table.getFilteredRowModel().rows.length === data.length
      ? "all rows"
      : `${table.getFilteredRowModel().rows.length} of ${data.length}`;

  return {
    table,
    activeRoleFilter: roleQuickFilter,
    onRoleQuickFilterChange,
    selectedCount,
    sortedSummary,
    filteredSummary,
  };
}
