export type ContactMode = "AUTO" | "MANUAL";
export type ContactLabel = "UNKNOWN" | "LEAD" | "CLIENT" | "RELATIVE" | "VIP";

export interface IContactRule {
  phone: string;
  mode: ContactMode;
  label: ContactLabel;
  notes?: string;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactRuleDB extends IContactRule {
  _id: string;
}

export interface UpsertContactRuleDTO {
  phone: string;
  mode: ContactMode;
  label: ContactLabel;
  notes?: string;
  enabled?: boolean;
}
