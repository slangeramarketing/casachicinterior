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
}

export interface LeadResponseDTO {
  id: string;
  phone: string;
  name?: string;
  location?: string;
  requirement?: string;
  status: string;
  createdAt: string;
}
