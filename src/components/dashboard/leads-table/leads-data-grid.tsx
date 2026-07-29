"use client";

import { flexRender } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Columns3,
  Search,
} from "lucide-react";
import { LEAD_TYPE_FILTERS } from "@/components/dashboard/leads-table/columns";
import {
  useLeadsTable,
  type LeadsTableStateMode,
} from "@/components/dashboard/leads-table/use-leads-table";
import { cn } from "@/lib/utils";
import type { LeadListItem } from "@/lib/leads/types";

type LeadsDataGridProps = {
  leads: LeadListItem[];
  /** `local` (default) or `url` to sync filter/sort/page to search params */
  stateMode?: LeadsTableStateMode;
};

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ArrowUp className="h-3.5 w-3.5" aria-hidden />;
  if (sorted === "desc") return <ArrowDown className="h-3.5 w-3.5" aria-hidden />;
  return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden />;
}

/**
 * Product UI for the headless TanStack leads table.
 * Table state is owned by `useLeadsTable` (local React state or URL sync).
 */
export function LeadsDataGrid({
  leads,
  stateMode = "local",
}: LeadsDataGridProps) {
  const router = useRouter();
  const {
    table,
    activeTypeFilter,
    onTypeQuickFilterChange,
    selectedCount,
    sortedSummary,
    filteredSummary,
  } = useLeadsTable({ data: leads, stateMode });

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 px-6 py-16 text-center">
        <p className="text-base font-semibold text-logo-bg">No leads yet</p>
        <p className="mt-2 text-sm text-foreground/55">
          Submissions from contact, service, price calculator, and newsletter
          forms will appear here.
        </p>
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
            <span className="sr-only">Search leads</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
              aria-hidden
            />
            <input
              type="search"
              value={String(table.getState().globalFilter ?? "")}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              placeholder="Search customers, phone, email, or source…"
              className="w-full rounded-xl border border-black/15 py-2.5 pl-10 pr-3 text-sm text-logo-bg outline-none placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </label>

          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by lead type"
          >
            {LEAD_TYPE_FILTERS.map((filter) => {
              const active = activeTypeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onTypeQuickFilterChange(filter.id)}
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
              Type
              <select
                className="bg-transparent text-logo-bg outline-none"
                value={activeTypeFilter}
                onChange={(event) =>
                  onTypeQuickFilterChange(
                    event.target.value as typeof activeTypeFilter,
                  )
                }
              >
                {LEAD_TYPE_FILTERS.map((filter) => (
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
            Website leads with sorting, filtering, and pagination
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
                  No leads match your filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  role="link"
                  tabIndex={0}
                  onClick={() =>
                    router.push(`/tb-dashboard/leads/${row.original.id}`)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(`/tb-dashboard/leads/${row.original.id}`);
                    }
                  }}
                  className={cn(
                    "cursor-pointer border-b border-black/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary",
                    row.getIsSelected() && "outline outline-1 outline-primary/40",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="truncate px-2 py-2.5 sm:px-3"
                    >
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
