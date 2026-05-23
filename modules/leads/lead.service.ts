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
import { contactRuleService } from "../contacts/contact-rule.service";

function calculateLeadScore(lead: Partial<ILeadDB>): number {
  let score = 0;
  if (lead.intent) {
    const intentLower = lead.intent.toLowerCase();
    if (intentLower.includes("urgent")) score += 20;
    if (intentLower.includes("office")) score += 25;
    if (intentLower.includes("pricing") || intentLower.includes("cost")) score += 15;
  }
  if (lead.requirement) {
    const reqLower = lead.requirement.toLowerCase();
    if (reqLower.includes("office")) score += 25;
  }
  if (lead.status === "SITE_VISIT") score += 50;
  if (lead.status === "QUALIFIED") score += 30;
  if (lead.status === "NEW") score += 10;
  return Math.min(score, 100);
}

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
        status: "NEW",
        automationMode: "AUTO",
        leadScore: calculateLeadScore({ intent: input.intent, requirement: input.requirement, status: "NEW" }),
        timeline: [{ event: "Lead Created", details: "Lead generated via WhatsApp", timestamp: new Date() }],
        conversationState: input.conversationState || {}
      });
    }

    // Lead exists: Build update payload for missing/new fields
    const updateData: Partial<ILeadDB> = {};
    if (input.name && !existingLead.name) updateData.name = input.name;
    if (input.location && !existingLead.location) updateData.location = input.location;
    if (input.requirement && !existingLead.requirement) updateData.requirement = input.requirement;
    if (input.intent) updateData.intent = input.intent;
    if (input.portfolioSent !== undefined) updateData.portfolioSent = input.portfolioSent;
    
    // Merge conversationState if provided
    if (input.conversationState) {
      updateData.conversationState = {
        ...(existingLead.conversationState || {}),
        ...input.conversationState
      };
    }

    // Always update timestamp
    updateData.updatedAt = new Date();
    updateData.lastActivityAt = new Date();
    updateData.leadScore = calculateLeadScore({ ...existingLead, ...updateData });

    // Auto Conversion Rule
    const finalStatus = updateData.status || existingLead.status;
    const clientStatuses = ["QUALIFIED", "SITE_VISIT", "QUOTE_SENT", "NEGOTIATION", "CONVERTED"];
    if (clientStatuses.includes(finalStatus) && existingLead.label !== "CLIENT") {
      updateData.label = "CLIENT";
      updateData.conversationOwner = "MANUAL";
      updateData.automationMode = "MANUAL";
      updateData.convertedAt = new Date();
      updateData.automationStoppedAt = new Date();
      updateData.timeline = existingLead.timeline || [];
      updateData.timeline.push({ event: "Auto Converted", details: `Lead converted to CLIENT (Status: ${finalStatus})`, timestamp: new Date() });
    }

    console.log("Before Update:", existingLead);
    console.log("After Update (Payload):", updateData);

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
  },

  /**
   * Admin update a lead manually
   */
  async updateLead(oldPhone: string, updates: Partial<ILeadDB>, updatedBy: string = "Admin"): Promise<ILeadDB> {
    const existing = await leadRepository.findByPhone(oldPhone);
    if (!existing) throw new Error("Lead not found");

    // Check unique phone if changing
    if (updates.phone && updates.phone !== oldPhone) {
      const duplicate = await leadRepository.findByPhone(updates.phone);
      if (duplicate) throw new Error("Phone number already exists for another lead.");
    }

    const timeline = existing.timeline || [];
    if (updates.status && updates.status !== existing.status) {
      timeline.push({ event: "Status Changed", details: `Status changed to ${updates.status}`, timestamp: new Date() });
      
      // Auto Conversion Rule check
      const clientStatuses = ["QUALIFIED", "SITE_VISIT", "QUOTE_SENT", "NEGOTIATION", "CONVERTED"];
      if (clientStatuses.includes(updates.status) && existing.label !== "CLIENT") {
        updates.label = "CLIENT";
        updates.conversationOwner = "MANUAL";
        updates.automationMode = "MANUAL";
        updates.convertedAt = new Date();
        updates.automationStoppedAt = new Date();
        timeline.push({ event: "Auto Converted", details: `Lead manually updated to CLIENT (Status: ${updates.status})`, timestamp: new Date() });
      }
    }
    if (updates.automationMode && updates.automationMode !== existing.automationMode) {
      timeline.push({ event: "Automation Changed", details: `Mode set to ${updates.automationMode}`, timestamp: new Date() });
      // Sync to contact rules
      await contactRuleService.upsertRule({
        phone: updates.phone || oldPhone,
        mode: updates.automationMode as "AUTO" | "MANUAL",
        label: existing.label === "CLIENT" ? "CLIENT" : "LEAD",
        enabled: true
      });
    }

    timeline.push({ event: "Manual Update", details: `Updated by ${updatedBy}`, timestamp: new Date() });

    const merged = { ...existing, ...updates };
    updates.leadScore = calculateLeadScore(merged);
    updates.updatedBy = updatedBy;
    updates.updatedAt = new Date();
    updates.timeline = timeline;

    const result = await leadRepository.updateByPhone(oldPhone, updates);
    if (!result) throw new Error("Failed to update lead");
    return result;
  },

  async bulkUpdateLeads(phones: string[], updates: Partial<ILeadDB>, updatedBy: string = "Admin"): Promise<any> {
    const result = await leadRepository.bulkUpdate(phones, { ...updates, updatedBy });
    if (updates.automationMode) {
      const mode = updates.automationMode as "AUTO" | "MANUAL";
      await Promise.all(phones.map(p => contactRuleService.upsertRule({
        phone: p,
        mode: mode,
        label: "LEAD",
        enabled: true
      })));
    }
    return result;
  },

  async getStats(): Promise<any> {
    return await leadRepository.getStats();
  }
};
