/***************************************************
 * File: modules/leads/lead.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Entry point for server-side logic (e.g. Admin Panel)
 *
 * Responsibilities:
 * - Call service methods and map outputs to DTOs
 * - NO DB logic, NO business logic
 ***************************************************/
import { leadMapper } from "./lead.mapper";
import { leadRepository } from "./lead.repository";
import { LeadResponseDTO } from "./lead.dto";

export const leadServer = {
  /**
   * Gets all leads (for admin lists), dynamically passing search and filter params.
   */
  async getAllLeads(params?: { search?: string; status?: string }): Promise<LeadResponseDTO[]> {
    const { leadService } = await import("./lead.service");
    const dbLeads = await leadService.getAllLeads(params);
    return dbLeads.map(leadMapper.toResponse);
  },

  /**
   * Gets a single lead by phone
   */
  async getLeadByPhone(phone: string): Promise<LeadResponseDTO | null> {
    const dbLead = await leadRepository.findByPhone(phone);
    if (!dbLead) return null;
    return leadMapper.toResponse(dbLead);
  },

  /**
   * Deletes a lead by phone. Can be used as a Server Action.
   */
  async deleteLead(phone: string): Promise<boolean> {
    const { leadService } = await import("./lead.service");
    // Ensure admin is verified here ideally, but logic simply calls service.
    return await leadService.deleteLead(phone);
  }
};
