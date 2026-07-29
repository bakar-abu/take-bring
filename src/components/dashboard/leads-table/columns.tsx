"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { displayLeadValue } from "@/lib/leads/helpers";
import type { LeadListItem, LeadType } from "@/lib/leads/types";

export const LEAD_TYPE_FILTERS: Array<{
  id: "all" | LeadType;
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "contact", label: "Contact" },
  { id: "price-calculator", label: "Calculator" },
  { id: "newsletter", label: "Newsletter" },
];

export function formatLeadDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function leadTypeBadgeClass(type: LeadType) {
  switch (type) {
    case "contact":
      return "text-emerald-700 ring-1 ring-emerald-600/30";
    case "price-calculator":
      return "text-amber-700 ring-1 ring-amber-600/30";
    case "newsletter":
      return "text-sky-700 ring-1 ring-sky-600/30";
    default:
      return "text-logo-bg/70 ring-1 ring-black/15";
  }
}

/**
 * Headless column definitions — no markup ownership beyond cell render helpers.
 * Product UI decides layout; these defs drive sorting/filtering/visibility.
 */
export function createLeadsColumns(): ColumnDef<LeadListItem>[] {
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
          aria-label={`Select ${displayLeadValue(row.original.fullName)}`}
          className="h-4 w-4 rounded border-black/30 bg-transparent accent-primary"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(event) => event.stopPropagation()}
        />
      ),
    },
    {
      accessorKey: "fullName",
      id: "fullName",
      header: "Customer",
      cell: ({ row }) => (
        <span className="truncate font-semibold text-logo-bg">
          {displayLeadValue(row.original.fullName)}
        </span>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "type",
      id: "type",
      header: "Type",
      cell: ({ getValue }) => {
        const type = getValue<LeadType>();
        return (
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold lowercase ${leadTypeBadgeClass(type)}`}
          >
            {type.replace("-", " ")}
          </span>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        return row.getValue(columnId) === filterValue;
      },
    },
    {
      accessorKey: "phone",
      id: "phone",
      header: "Phone",
      cell: ({ getValue }) => (
        <span className="truncate text-foreground/80">
          {displayLeadValue(getValue<string>())}
        </span>
      ),
    },
    {
      accessorKey: "email",
      id: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="block truncate text-foreground/80" title={row.original.email}>
          {displayLeadValue(row.original.email)}
        </span>
      ),
    },
    {
      accessorKey: "pickupAddress",
      id: "pickupAddress",
      header: "Pickup",
      cell: ({ row }) => (
        <span
          className="block truncate text-foreground/80"
          title={row.original.pickupAddress || undefined}
        >
          {displayLeadValue(row.original.pickupAddress)}
        </span>
      ),
    },
    {
      accessorKey: "deliveryAddress",
      id: "deliveryAddress",
      header: "Delivery",
      cell: ({ row }) => (
        <span
          className="block truncate text-foreground/80"
          title={row.original.deliveryAddress || undefined}
        >
          {displayLeadValue(row.original.deliveryAddress)}
        </span>
      ),
    },
    {
      accessorKey: "sourcePage",
      id: "sourcePage",
      header: "Source",
      cell: ({ row }) => (
        <span
          className="block truncate text-foreground/70"
          title={row.original.sourceLabel}
        >
          {displayLeadValue(row.original.sourcePage)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      id: "createdAt",
      header: "Date",
      cell: ({ getValue }) => (
        <span className="block truncate text-foreground/60">
          {formatLeadDate(getValue<string>())}
        </span>
      ),
      sortingFn: "datetime",
    },
  ];
}
