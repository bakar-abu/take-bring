export type LeadType = "contact" | "newsletter" | "price-calculator";

export type LeadStatus = "NEW" | "READ" | "ARCHIVED";

export const LEAD_STATUSES: LeadStatus[] = ["NEW", "READ", "ARCHIVED"];

export type Lead = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  type: LeadType;
  status: LeadStatus;
  formKey: string;
  sourcePage: string;
  sourceLabel: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  inquiryType: string;
  message: string;
  pickupAddress: string;
  deliveryAddress: string;
  length: string;
  width: string;
  height: string;
};

export type LeadInput = {
  type: LeadType;
  formKey: string;
  sourcePage?: string;
  fullName?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  inquiryType?: string;
  message?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  length?: string;
  width?: string;
  height?: string;
};

export type LeadListItem = Pick<
  Lead,
  | "id"
  | "createdAt"
  | "fullName"
  | "email"
  | "phone"
  | "pickupAddress"
  | "deliveryAddress"
  | "sourceLabel"
  | "sourcePage"
  | "type"
  | "formKey"
  | "status"
>;
