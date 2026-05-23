import { contactRuleRepository } from "./contact-rule.repository";
import { UpsertContactRuleDTO, IContactRuleDB } from "./contact-rule.types";

export const contactRuleService = {
  async getRuleByPhone(phone: string): Promise<IContactRuleDB | null> {
    return await contactRuleRepository.findByPhone(phone);
  },

  async upsertRule(input: UpsertContactRuleDTO): Promise<IContactRuleDB> {
    const dataToUpsert: any = { phone: input.phone, mode: input.mode, label: input.label };
    if (input.notes !== undefined) dataToUpsert.notes = input.notes;
    if (input.enabled !== undefined) dataToUpsert.enabled = input.enabled;
    
    return await contactRuleRepository.upsert(dataToUpsert);
  },

  async deleteRule(phone: string): Promise<boolean> {
    return await contactRuleRepository.delete(phone);
  },

  async getAllRules(query?: any): Promise<IContactRuleDB[]> {
    return await contactRuleRepository.findAll(query);
  },

  async bulkUpsertRules(rules: any[]): Promise<any> {
    return await contactRuleRepository.bulkUpsert(rules);
  },

  async bulkDeleteRules(phones: string[]): Promise<any> {
    return await contactRuleRepository.bulkDelete(phones);
  },

  async getStats(): Promise<any> {
    return await contactRuleRepository.getStats();
  }
};
