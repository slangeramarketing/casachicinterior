/***************************************************
 * File: modules/whatsapp/whatsapp.intent.ts
 * Layer: Helper / Internal
 *
 * Purpose:
 * - Detects user intent from the incoming WhatsApp message
 *
 * Responsibilities:
 * - Match keywords to return specific intents
 * - Return: "pricing" | "site_visit" | "design" | "general"
 ***************************************************/

export type WhatsappIntent = "pricing" | "site_visit" | "design" | "general";

export const whatsappIntent = {
  /**
   * Purpose: Matches basic keywords to determine intent
   * @param message Raw text message from user
   * @returns WhatsappIntent string
   */
  detect(message: string): WhatsappIntent {
    const lowerMessage = message.toLowerCase();

    // Pricing Intent Keywords
    if (lowerMessage.match(/(price|cost|charge|kitna|kitne|paisa|budget|quote|estimate)/)) {
      return "pricing";
    }

    // Site Visit Intent Keywords
    if (lowerMessage.match(/(visit|meet|appointment|location|address|office|milna|site)/)) {
      return "site_visit";
    }

    // Design / Service Intent Keywords
    if (lowerMessage.match(/(design|interior|room|kitchen|bedroom|living|style|portfolio|services|kaam)/)) {
      return "design";
    }

    // Fallback General Intent
    return "general";
  }
};
