/***************************************************
 * File: modules/leads/lead.service.ts
 * Layer: Service (Core Logic)
 *
 * Purpose:
 * - Manages business logic for leads
 *
 * Responsibilities:
 * - Upsert lead, maintain message history, manage status
 * - Orchestrate repository calls
 * - NO formatting, NO DTO returns
 ***************************************************/
import { leadRepository } from "./lead.repository";
import { UpsertLeadDTO } from "./lead.dto";
import { ILeadDB } from "./lead.types";

export const leadService = {
  /**
   * Upserts a lead based on phone number.
   * If new, creates it. If exists, updates only missing fields and pushes messages.
   */
  async upsertLead(input: UpsertLeadDTO): Promise<ILeadDB> {
    const existingLead = await leadRepository.findByPhone(input.phone);

    if (!existingLead) {
      // Create new lead
      const initialMessages = input.message ? [input.message] : [];
      return await leadRepository.create({
        phone: input.phone,
        name: input.name,
        location: input.location,
        requirement: input.requirement,
        intent: input.intent,
        messages: initialMessages,
        status: "new"
      });
    }

    // Lead exists: Build update payload for missing/new fields
    const updateData: Partial<ILeadDB> = {};
    if (input.name && !existingLead.name) updateData.name = input.name;
    if (input.location && !existingLead.location) updateData.location = input.location;
    if (input.requirement && !existingLead.requirement) updateData.requirement = input.requirement;
    if (input.intent) updateData.intent = input.intent;
    
    // Always update timestamp
    updateData.updatedAt = new Date();

    // Update base fields
    await leadRepository.updateByPhone(input.phone, updateData);

    // Push new message if provided
    if (input.message) {
      const updatedWithMsg = await leadRepository.pushMessage(input.phone, input.message);
      if (updatedWithMsg) return updatedWithMsg;
    }

    // Fallback if no message was pushed
    const finalLead = await leadRepository.findByPhone(input.phone);
    if (!finalLead) throw new Error("Lead update failure");
    return finalLead;
  },

  /**
   * Retrieves all leads, optionally filtered by search and status.
   */
  async getAllLeads(query?: { search?: string; status?: string }): Promise<ILeadDB[]> {
    return await leadRepository.findAll(query);
  },

  /**
   * Retrieves a lead by phone number directly from the repository.
   */
  async getLeadByPhone(phone: string): Promise<ILeadDB | null> {
    return await leadRepository.findByPhone(phone);
  },

  /**
   * Deletes a lead by phone number.
   */
  async deleteLead(phone: string): Promise<boolean> {
    if (!phone) throw new Error("Phone number is required");
    const success = await leadRepository.deleteByPhone(phone);
    if (!success) throw new Error("Lead not found");
    return success;
  }
};
