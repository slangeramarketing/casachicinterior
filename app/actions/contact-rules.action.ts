"use server";

import { contactRuleService } from "@/modules/contacts/contact-rule.service";
import { UpsertContactRuleDTO } from "@/modules/contacts/contact-rule.types";
import { whatsappRule } from "@/modules/whatsapp/whatsapp.rule";
import { revalidatePath } from "next/cache";

export async function upsertContactRuleAction(input: UpsertContactRuleDTO) {
  try {
    await contactRuleService.upsertRule(input);
    whatsappRule.clearCache(input.phone);
    revalidatePath("/admin/leads");
    return { success: true, message: "Rule updated successfully" };
  } catch (error: any) {
    console.error("Error upserting contact rule:", error);
    return { success: false, message: error.message || "Failed to update rule" };
  }
}

export async function deleteContactRuleAction(phone: string) {
  try {
    await contactRuleService.deleteRule(phone);
    whatsappRule.clearCache(phone);
    revalidatePath("/admin/leads");
    return { success: true, message: "Rule deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting contact rule:", error);
    return { success: false, message: error.message || "Failed to delete rule" };
  }
}

export async function toggleContactRuleAction(phone: string, enabled: boolean) {
  try {
    // Only updating enabled flag requires getting the current rule first, 
    // or passing the mandatory fields. Let's fetch it first.
    const existing = await contactRuleService.getRuleByPhone(phone);
    if (!existing) {
       return { success: false, message: "Rule not found" };
    }
    
    await contactRuleService.upsertRule({
      phone: existing.phone,
      mode: existing.mode,
      label: existing.label,
      enabled: enabled
    });
    
    whatsappRule.clearCache(phone);
    revalidatePath("/admin/leads");
    return { success: true, message: `Rule ${enabled ? 'enabled' : 'disabled'}` };
  } catch (error: any) {
    console.error("Error toggling contact rule:", error);
    return { success: false, message: error.message || "Failed to toggle rule" };
  }
}

export async function bulkImportContactRulesAction(rules: UpsertContactRuleDTO[]) {
  try {
    const result = await contactRuleService.bulkUpsertRules(rules);
    rules.forEach(r => whatsappRule.clearCache(r.phone));
    revalidatePath("/admin/leads");
    return { 
      success: true, 
      added: result.upsertedCount + result.modifiedCount,
      skipped: rules.length - (result.upsertedCount + result.modifiedCount) 
    };
  } catch (error: any) {
    console.error("Error bulk importing rules:", error);
    return { success: false, message: error.message || "Failed to import rules" };
  }
}

export async function bulkDeleteContactRulesAction(phones: string[]) {
  try {
    const result = await contactRuleService.bulkDeleteRules(phones);
    phones.forEach(p => whatsappRule.clearCache(p));
    revalidatePath("/admin/leads");
    return { success: true, message: `Deleted ${result.deletedCount} rules` };
  } catch (error: any) {
    console.error("Error bulk deleting rules:", error);
    return { success: false, message: error.message || "Failed to bulk delete rules" };
  }
}
