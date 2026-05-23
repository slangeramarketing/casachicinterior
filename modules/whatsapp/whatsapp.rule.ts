import { ILeadDB } from "../leads/lead.types";
import { contactRuleService } from "../contacts/contact-rule.service";

export interface AutomationRuleResult {
  allowWebhook: boolean;
  allowAI: boolean;
  allowReply: boolean;
  allowDB: boolean;
  reason: string;
}

export const whatsappRule = {
  /**
   * Determines if the incoming message should be processed based on contact ownership logic.
   */
  async shouldProcessAutomation(phone: string, lead: ILeadDB | null): Promise<AutomationRuleResult> {
    // 1. If no lead exists yet, it's a completely new user.
    if (!lead) {
      return {
        allowWebhook: true,
        allowAI: true,
        allowReply: true,
        allowDB: true,
        reason: "New user, auto-enabled"
      };
    }

    const label = lead.label || "UNKNOWN";
    const owner = lead.conversationOwner || lead.automationMode || "AUTO";

    // 2. Hard block for RELATIVE
    if (label === "RELATIVE") {
      return {
        allowWebhook: true, // Always return 200 OK
        allowAI: false,
        allowReply: false,
        allowDB: false, // Do not even save messages
        reason: "Contact is marked as RELATIVE"
      };
    }

    // 3. Block AI/Reply for specific labels but allow DB save
    if (["CLIENT", "VIP", "TEAM"].includes(label)) {
      return {
        allowWebhook: true,
        allowAI: false,
        allowReply: false,
        allowDB: true,
        reason: `Contact is marked as ${label}`
      };
    }

    // 4. Check explicit ownership mode
    if (owner === "MANUAL") {
      return {
        allowWebhook: true,
        allowAI: false,
        allowReply: false,
        allowDB: true,
        reason: "Conversation owner is MANUAL"
      };
    }

    // 5. Legacy Contact Rule check (backward compatibility)
    try {
      const rule = await contactRuleService.getRuleByPhone(phone);
      if (rule && (!rule.enabled || rule.mode === "MANUAL")) {
        return {
          allowWebhook: true,
          allowAI: false,
          allowReply: false,
          allowDB: true,
          reason: "Legacy contact rule is set to MANUAL"
        };
      }
    } catch (error) {
      console.error(`[Rule] Error checking legacy rule for ${phone}:`, error);
    }

    // Default: Allow everything
    return {
      allowWebhook: true,
      allowAI: true,
      allowReply: true,
      allowDB: true,
      reason: "Auto-enabled (Lead/Unknown)"
    };
  },

  /**
   * Clears the cache for a specific phone, usually called when a rule is updated from Admin Dashboard
   * Note: Cache is no longer used since we directly fetch the lead, but kept for backward compatibility.
   */
  clearCache(phone: string) {
    // No-op
  }
};
