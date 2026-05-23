import { contactRuleService } from "./contact-rule.service";

export const contactRuleServer = {
  async list(query?: any) {
    try {
      return await contactRuleService.getAllRules(query);
    } catch (error) {
      console.error("Error fetching contact rules:", error);
      return [];
    }
  },

  async get(phone: string) {
    try {
      return await contactRuleService.getRuleByPhone(phone);
    } catch (error) {
      console.error(`Error fetching contact rule for ${phone}:`, error);
      return null;
    }
  },

  async getStats() {
    try {
      return await contactRuleService.getStats();
    } catch (error) {
      console.error("Error fetching contact rule stats:", error);
      return { manual: 0, auto: 0, disabled: 0, total: 0 };
    }
  }
};
