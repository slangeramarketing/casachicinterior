"use server";

import { leadServer } from "@/modules/leads/lead.server";
import { revalidatePath } from "next/cache";

export async function updateLeadDetailsAction(oldPhone: string, updates: any) {
  try {
    const result = await leadServer.updateLead(oldPhone, updates);
    revalidatePath("/admin/leads");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error updating lead details:", error);
    return { success: false, message: error.message || "Failed to update lead" };
  }
}

export async function bulkUpdateLeadsAction(phones: string[], updates: any) {
  try {
    const result = await leadServer.bulkUpdateLeads(phones, updates);
    revalidatePath("/admin/leads");
    return { success: true, message: `Updated ${result.modifiedCount} leads` };
  } catch (error: any) {
    console.error("Error bulk updating leads:", error);
    return { success: false, message: error.message || "Failed to bulk update leads" };
  }
}
