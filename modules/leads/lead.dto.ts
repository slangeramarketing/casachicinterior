/***************************************************
 * File: modules/leads/lead.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Defines data transfer objects for inputs and outputs
 *
 * Responsibilities:
 * - Input validation shapes (UpsertLeadDTO)
 * - Safe output shapes (LeadResponseDTO)
 ***************************************************/

export interface UpsertLeadDTO {
  phone: string;
  name?: string;
  location?: string;
  requirement?: string;
  message?: string;
  intent?: string;
  portfolioSent?: boolean;
  conversationState?: {
    askedStyle?: boolean;
    askedBudget?: boolean;
    askedKitchenSize?: boolean;
    sharedPortfolio?: boolean;
    sharedWebsite?: boolean;
  };
  leadScore?: number;
  owner?: string;
  notes?: string;
  automationMode?: "AUTO" | "MANUAL";
  updatedBy?: string;
  status?: string;
}

export interface LeadResponseDTO {
  id: string;
  phone: string;
  name?: string;
  location?: string;
  requirement?: string;
  portfolioSent?: boolean;
  status: string;
  leadScore: number;
  owner?: string;
  notes?: string;
  automationMode: "AUTO" | "MANUAL";
  label?: string;
  conversationOwner?: "AUTO" | "MANUAL";
  convertedAt?: string;
  automationStoppedAt?: string;
  lastActivityAt: string;
  timeline: { event: string; details?: string; timestamp: string }[];
  createdAt: string;
  messages: string[];
}
