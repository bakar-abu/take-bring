"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { createLeadsColumns } from "@/components/dashboard/leads-table/columns";
import type { LeadListItem, LeadType } from "@/lib/leads/types";

export type LeadsTableStateMode = "local" | "url";

type UseLeadsTableOptions = {
  data: LeadListItem[];
  /**
   * `local` — product UI owns state in React.
   * `url` — sorting/filtering/pagination synced to search params (shareable/server-ready).
   */
  stateMode?: LeadsTableStateMode;
  pageSize?: number;
};

function parseSorting(raw: string | null): SortingState {
  if (!raw) return [{ id: "createdAt", desc: true }];
  const [id, dir] = raw.split(":");
  if (!id) return [{ id: "createdAt", desc: true }];
  return [{ id, desc: dir === "desc" }];
}

function serializeSorting(sorting: SortingState) {
  const first = sorting[0];
  if (!first) return "";
  return `${first.id}:${first.desc ? "desc" : "asc"}`;
}

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === "function"
    ? (updater as (old: T) => T)(previous)
    : updater;
}

/**
 * Headless TanStack Table controller.
 * Owns row models + controlled state; markup stays in the product UI.
 */
export function useLeadsTable({
  data,
  stateMode = "local",
  pageSize = 8,
}: UseLeadsTableOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = useMemo(() => createLeadsColumns(), []);

  const [localSorting, setLocalSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [localColumnFilters, setLocalColumnFilters] = useState<ColumnFiltersState>(
    [],
  );
  const [localGlobalFilter, setLocalGlobalFilter] = useState("");
  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    sourcePage: false,
    createdAt: false,
  });
  const [typeQuickFilter, setTypeQuickFilter] = useState<"all" | LeadType>("all");

  const syncUrl = useCallback(
    (next: {
      q?: string;
      type?: string;
      sort?: string;
      page?: number;
    }) => {
      if (stateMode !== "url") return;
      const params = new URLSearchParams(searchParams.toString());
      if (next.q !== undefined) {
        if (next.q) params.set("q", next.q);
        else params.delete("q");
      }
      if (next.type !== undefined) {
        if (next.type && next.type !== "all") params.set("type", next.type);
        else params.delete("type");
      }
      if (next.sort !== undefined) {
        if (next.sort) params.set("sort", next.sort);
        else params.delete("sort");
      }
      if (next.page !== undefined) {
        if (next.page > 0) params.set("page", String(next.page + 1));
        else params.delete("page");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams, stateMode],
  );

  const sorting =
    stateMode === "url" ? parseSorting(searchParams.get("sort")) : localSorting;

  const globalFilter =
    stateMode === "url" ? (searchParams.get("q") ?? "") : localGlobalFilter;

  const urlType = (searchParams.get("type") as "all" | LeadType | null) ?? "all";
  const activeTypeFilter = stateMode === "url" ? urlType : typeQuickFilter;

  const columnFilters: ColumnFiltersState =
    stateMode === "url"
      ? activeTypeFilter && activeTypeFilter !== "all"
        ? [{ id: "type", value: activeTypeFilter }]
        : []
      : localColumnFilters;

  const pagination: PaginationState =
    stateMode === "url"
      ? {
          pageIndex: Math.max(0, Number(searchParams.get("page") ?? "1") - 1),
          pageSize,
        }
      : localPagination;

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
    onSortingChange: (updater) => {
      const next = resolveUpdater(updater, sorting);
      if (stateMode === "url") {
        syncUrl({ sort: serializeSorting(next), page: 0 });
      } else {
        setLocalSorting(next);
      }
    },
    onColumnFiltersChange: setLocalColumnFilters,
    onGlobalFilterChange: (updater) => {
      const next = String(resolveUpdater(updater, globalFilter) ?? "");
      if (stateMode === "url") {
        syncUrl({ q: next, page: 0 });
      } else {
        setLocalGlobalFilter(next);
        setLocalPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }
    },
    onPaginationChange: (updater) => {
      const next = resolveUpdater(updater, pagination);
      if (stateMode === "url") {
        syncUrl({ page: next.pageIndex });
      } else {
        setLocalPagination(next);
      }
    },
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
      const haystack = [
        row.original.fullName,
        row.original.email,
        row.original.phone,
        row.original.pickupAddress,
        row.original.deliveryAddress,
        row.original.sourcePage,
        row.original.sourceLabel,
        row.original.type,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    },
  });

  const onTypeQuickFilterChange = (value: "all" | LeadType) => {
    if (stateMode === "url") {
      syncUrl({ type: value, page: 0 });
    } else {
      setTypeQuickFilter(value);
      setLocalColumnFilters(value === "all" ? [] : [{ id: "type", value }]);
      setLocalPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
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
    activeTypeFilter,
    onTypeQuickFilterChange,
    selectedCount,
    sortedSummary,
    filteredSummary,
    stateMode,
  };
}
