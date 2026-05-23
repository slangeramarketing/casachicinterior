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
  async deleteLead(phone: string) {
    const { leadService } = await import("./lead.service");
    try {
      return await leadService.deleteLead(phone);
    } catch (error) {
      console.error(`Error deleting lead ${phone}:`, error);
      return false;
    }
  },

  async updateLead(oldPhone: string, updates: any, updatedBy: string = "Admin") {
    const { leadService } = await import("./lead.service");
    try {
      const dbLead = await leadService.updateLead(oldPhone, updates, updatedBy);
      return leadMapper.toResponse(dbLead);
    } catch (error) {
      console.error(`Error updating lead ${oldPhone}:`, error);
      throw error;
    }
  },

  async bulkUpdateLeads(phones: string[], updates: any, updatedBy: string = "Admin") {
    const { leadService } = await import("./lead.service");
    try {
      return await leadService.bulkUpdateLeads(phones, updates, updatedBy);
    } catch (error) {
      console.error("Error bulk updating leads:", error);
      throw error;
    }
  },

  async getStats() {
    const { leadService } = await import("./lead.service");
    try {
      return await leadService.getStats();
    } catch (error) {
      console.error("Error getting lead stats:", error);
      return { total: 0, new: 0, qualified: 0, converted: 0, manual: 0, auto: 0 };
    }
  }
};
