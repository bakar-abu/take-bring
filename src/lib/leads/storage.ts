import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { normalizeLeadInput } from "@/lib/leads/helpers";
import type { Lead, LeadInput, LeadListItem } from "@/lib/leads/types";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.writeFile(LEADS_FILE, "[]\n", "utf8");
  }
}

async function readLeads(): Promise<Lead[]> {
  await ensureStore();
  const raw = await fs.readFile(LEADS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as Lead[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLeads(leads: Lead[]) {
  await ensureStore();
  await fs.writeFile(LEADS_FILE, `${JSON.stringify(leads, null, 2)}\n`, "utf8");
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const lead: Lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...normalizeLeadInput(input),
  };

  const leads = await readLeads();
  leads.unshift(lead);
  await writeLeads(leads);
  return lead;
}

export async function listLeads(): Promise<LeadListItem[]> {
  const leads = await readLeads();
  return leads.map((lead) => ({
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
  }));
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const leads = await readLeads();
  return leads.find((lead) => lead.id === id) ?? null;
}
