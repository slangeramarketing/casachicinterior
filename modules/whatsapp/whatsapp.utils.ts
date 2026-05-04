/***************************************************
 * File: modules/whatsapp/whatsapp.utils.ts
 * Layer: Helper / Internal
 *
 * Purpose:
 * - Utility functions for the WhatsApp module
 ***************************************************/

export const whatsappUtils = {
  detectLanguage(message: string): "hinglish" | "english" {
    const hindiWords = ["hai", "karna", "kya", "kaise", "mujhe", "krna"];
    const msg = message.toLowerCase();
    const isHinglish = hindiWords.some(word => msg.includes(word));
    return isHinglish ? "hinglish" : "english";
  }
};
