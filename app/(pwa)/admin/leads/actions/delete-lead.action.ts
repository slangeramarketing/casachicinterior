"use server";

import { leadServer } from "@/modules/leads/lead.server";

export async function deleteLeadAction(phone: string): Promise<boolean> {
  // Call the server facade to perform deletion
  return await leadServer.deleteLead(phone);
}
