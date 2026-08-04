import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { normalizeLeadInput } from "@/lib/leads/helpers";
import {
  mapLeadRow,
  toLeadListItem,
  type LeadRow,
} from "@/lib/leads/map";
import type {
  Lead,
  LeadInput,
  LeadListItem,
  LeadStatus,
} from "@/lib/leads/types";

const LEAD_SELECT =
  "id, created_at, updated_at, type, status, form_key, source_page, source_label, full_name, email, phone, whatsapp, inquiry_type, message, pickup_address, delivery_address, length, width, height" as const;

export async function createLead(input: LeadInput): Promise<Lead> {
  const normalized = normalizeLeadInput(input);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      type: normalized.type,
      status: "NEW",
      form_key: normalized.formKey,
      source_page: normalized.sourcePage,
      source_label: normalized.sourceLabel,
      full_name: normalized.fullName,
      email: normalized.email,
      phone: normalized.phone,
      whatsapp: normalized.whatsapp,
      inquiry_type: normalized.inquiryType,
      message: normalized.message,
      pickup_address: normalized.pickupAddress,
      delivery_address: normalized.deliveryAddress,
      length: normalized.length,
      width: normalized.width,
      height: normalized.height,
    })
    .select(LEAD_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapLeadRow(data as LeadRow);
}

export async function listLeads(): Promise<LeadListItem[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => toLeadListItem(mapLeadRow(row as LeadRow)));
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapLeadRow(data as LeadRow);
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<Lead> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select(LEAD_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapLeadRow(data as LeadRow);
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
