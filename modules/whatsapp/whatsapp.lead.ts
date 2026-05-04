/***************************************************
 * File: modules/whatsapp/whatsapp.lead.ts
 * Layer: State (In-Memory)
 *
 * Purpose:
 * - Tracks lead profile information during the conversation
 *
 * Responsibilities:
 * - Maintain Map<string, LeadProfile>
 * - Update lead data progressively
 ***************************************************/

export interface LeadProfile {
  name?: string;
  location?: string;
  requirement?: string;
  lastActive: Date;
}

const leadStore = new Map<string, LeadProfile>();

export const whatsappLead = {
  /**
   * Purpose: Gets the current lead profile for a user
   * @param userPhone The user's WhatsApp number ID
   */
  get(userPhone: string): LeadProfile | undefined {
    return leadStore.get(userPhone);
  },

  /**
   * Purpose: Updates or creates a lead profile
   * @param userPhone The user's WhatsApp number ID
   * @param data Partial lead data to merge
   */
  update(userPhone: string, data: Partial<LeadProfile>): void {
    const existing = leadStore.get(userPhone) || { lastActive: new Date() };
    const updated: LeadProfile = {
      ...existing,
      ...data,
      lastActive: new Date() // Always update last active time
    };
    leadStore.set(userPhone, updated);
  }
};
