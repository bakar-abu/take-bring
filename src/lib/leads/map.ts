import type { Lead, LeadListItem, LeadStatus, LeadType } from "@/lib/leads/types";

export type LeadRow = {
  id: string;
  created_at: string;
  updated_at?: string | null;
  type: LeadType;
  status: LeadStatus;
  form_key: string | null;
  source_page: string | null;
  source_label: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  inquiry_type: string | null;
  message: string | null;
  pickup_address: string | null;
  delivery_address: string | null;
  length: string | null;
  width: string | null;
  height: string | null;
};

function str(value: string | null | undefined) {
  return value?.trim() ? value : "";
}

export function mapLeadRow(row: LeadRow): Lead {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
    type: row.type,
    status: row.status ?? "NEW",
    formKey: str(row.form_key),
    sourcePage: str(row.source_page) || "/",
    sourceLabel: str(row.source_label),
    fullName: str(row.full_name),
    email: str(row.email),
    phone: str(row.phone),
    whatsapp: str(row.whatsapp),
    inquiryType: str(row.inquiry_type),
    message: str(row.message),
    pickupAddress: str(row.pickup_address),
    deliveryAddress: str(row.delivery_address),
    length: str(row.length),
    width: str(row.width),
    height: str(row.height),
  };
}

export function toLeadListItem(lead: Lead): LeadListItem {
  return {
    id: lead.id,
    createdAt: lead.createdAt,
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    pickupAddress: lead.pickupAddress,
    deliveryAddress: lead.deliveryAddress,
    sourceLabel: lead.sourceLabel,
    sourcePage: lead.sourcePage,
    type: lead.type,
    formKey: lead.formKey,
    status: lead.status,
  };
}
