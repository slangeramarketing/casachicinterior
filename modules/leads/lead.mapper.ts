/***************************************************
 * File: modules/leads/lead.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Transforms DB records to safe DTOs
 *
 * Responsibilities:
 * - Convert ObjectIds to strings
 * - Format dates to ISO strings
 * - NO business logic allowed here
 ***************************************************/
import { ILeadDB } from "./lead.types";
import { LeadResponseDTO } from "./lead.dto";

export const leadMapper = {
  /**
   * Transforms raw DB Lead into a safe client-facing DTO
   */
  toResponse(dbLead: ILeadDB): LeadResponseDTO {
    return {
      id: dbLead._id.toString(),
      phone: dbLead.phone,
      name: dbLead.name,
      location: dbLead.location,
      requirement: dbLead.requirement,
      status: dbLead.status,
      createdAt: dbLead.createdAt.toISOString()
    };
  }
};
