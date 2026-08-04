"use client";

import { flexRender } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Columns3,
  Search,
} from "lucide-react";
import { USER_ROLE_FILTERS } from "@/components/dashboard/users-table/columns";
import { useUsersTable } from "@/components/dashboard/users-table/use-users-table";
import { cn } from "@/lib/utils";
import type { DashboardUser } from "@/lib/dashboard-users/types";

type UsersDataGridProps = {
  users: DashboardUser[];
  onCreateClick?: () => void;
  onEditUser?: (user: DashboardUser) => void;
  onDeleteUser?: (user: DashboardUser) => void;
  busyUserId?: string | null;
};

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ArrowUp className="h-3.5 w-3.5" aria-hidden />;
  if (sorted === "desc") return <ArrowDown className="h-3.5 w-3.5" aria-hidden />;
  return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden />;
}

/**
 * Product UI for the headless TanStack users table (same format as leads).
 */
export function UsersDataGrid({
  users,
  onCreateClick,
  onEditUser,
  onDeleteUser,
  busyUserId,
}: UsersDataGridProps) {
  const {
    table,
    activeRoleFilter,
    onRoleQuickFilterChange,
    selectedCount,
    sortedSummary,
    filteredSummary,
  } = useUsersTable({ data: users, onEditUser, onDeleteUser, busyUserId });

  const resetFilters = () => {
    onRoleQuickFilterChange("all");
    table.setGlobalFilter("");
  };

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 px-6 py-16 text-center">
        <p className="text-base font-semibold text-logo-bg">No users yet</p>
        <p className="mt-2 text-sm text-foreground/55">
          Create dashboard accounts with Admin, Content Manager, or Viewer roles.
          New users are created in the database and can log in immediately.
        </p>
        {onCreateClick ? (
          <button
            type="button"
            onClick={onCreateClick}
            className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-logo-bg"
          >
            Create your first user
          </button>
        ) : null}
      </div>
    );
  }

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 text-logo-bg">
      <div className="space-y-3 border-b border-black/10 p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search users</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
              aria-hidden
            />
            <input
              type="search"
              value={String(table.getState().globalFilter ?? "")}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              placeholder="Search by name, email, or role…"
              className="w-full rounded-xl border border-black/15 py-2.5 pl-10 pr-3 text-sm text-logo-bg outline-none placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </label>

          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by role"
          >
            {USER_ROLE_FILTERS.map((filter) => {
              const active = activeRoleFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onRoleQuickFilterChange(filter.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "border-primary bg-primary text-logo-bg"
                      : "border-black/15 text-logo-bg/75 hover:border-primary/40 hover:text-logo-bg",
                  )}
                  aria-pressed={active}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center gap-2 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold text-logo-bg/70">
              Role
              <select
                className="bg-transparent text-logo-bg outline-none"
                value={activeRoleFilter}
                onChange={(event) =>
                  onRoleQuickFilterChange(
                    event.target.value as typeof activeRoleFilter,
                  )
                }
              >
                {USER_ROLE_FILTERS.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
            </label>

            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold text-logo-bg/70 hover:border-primary/40">
                <Columns3 className="h-3.5 w-3.5" aria-hidden />
                Columns
              </summary>
              <div className="absolute left-0 z-20 mt-2 min-w-[180px] rounded-xl border border-black/10 bg-white p-2 shadow-xl">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <label
                      key={column.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-logo-bg/80 hover:bg-black/[0.04]"
                    >
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                      />
                      {typeof column.columnDef.header === "string"
                        ? column.columnDef.header
                        : column.id}
                    </label>
                  ))}
              </div>
            </details>
          </div>

          <p className="text-xs font-medium text-foreground/50">
            {table.getFilteredRowModel().rows.length} rows / {selectedCount}{" "}
            selected
          </p>
        </div>
      </div>

      <div>
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <caption className="sr-only">
            Dashboard users with sorting, filtering, and pagination
          </caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-black/10">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const isSelect = header.column.id === "select";
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={cn(
                        "px-2 py-2.5 font-semibold text-logo-bg/80 sm:px-3",
                        isSelect ? "w-10" : "truncate",
                      )}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : canSort
                              ? "none"
                              : undefined
                      }
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="inline-flex max-w-full items-center gap-1 truncate hover:text-logo-bg"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="truncate">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                          <SortIcon sorted={sorted} />
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="px-2 py-12 text-center text-sm text-foreground/50"
                >
                  <div className="mx-auto max-w-xl space-y-3">
                    <p>No users match your filters.</p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-semibold text-logo-bg/80 transition-colors hover:border-primary/50 hover:text-logo-bg"
                    >
                      Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-black/5 transition-colors",
                    row.getIsSelected() && "outline outline-1 outline-primary/40",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="truncate px-2 py-2.5 sm:px-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-black/10 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex flex-wrap gap-2" aria-live="polite">
          <StateChip label="Filtered" value={filteredSummary} />
          <StateChip label="Sorted" value={sortedSummary} />
          <StateChip label="Selected" value={`${selectedCount} rows`} />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-semibold text-logo-bg/80 transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <span className="min-w-[3.5rem] text-center text-sm font-medium text-foreground/60">
            {pageCount === 0 ? "0 / 0" : `${pageIndex + 1} / ${pageCount}`}
          </span>
          <button
            type="button"
            className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-semibold text-logo-bg transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function StateChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-dark">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-logo-bg">{value}</p>
    </div>
  );
}
