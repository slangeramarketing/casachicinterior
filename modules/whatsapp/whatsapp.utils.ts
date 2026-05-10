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
  },

  /**
   * Purpose: Detects and neutralizes hallucinated scheduling confirmations or operational claims
   * @param response Raw AI generated response
   * @returns Sanitized response string
   */
  sanitizeSchedulingClaims(response: string): string {
    const unsafePhrases = [
      "meeting confirm",
      "appointment confirmed",
      "booking confirmed",
      "slot is booked",
      "see you tomorrow",
      "fixed your meeting",
      "documents laane",
      "document laane",
      "confirm hai",
      "booked hai",
      "schedule ho gaya",
      "kal 11 baje",
      "kal 10 baje"
    ];

    const lowerResponse = response.toLowerCase();
    const isUnsafe = unsafePhrases.some(phrase => lowerResponse.includes(phrase));

    if (isUnsafe) {
      console.warn(`[Safety] Unsafe scheduling claim detected in AI response: "${response}"`);
      
      // Rewrite the response to a safe alternative
      if (lowerResponse.includes("confirm") || lowerResponse.includes("booked")) {
        return "Aapka interest noted hai! Humaari team availability check karke aapko call ya message par confirm karegi. 👍";
      }
      
      if (lowerResponse.includes("document") || lowerResponse.includes("laane")) {
        return "Aap bas apna requirements share karein, baaki details team discuss kar legi. Kab milna prefer karenge?";
      }

      // Fallback safe closure
      return "Aapka preferred time share kar dijiye, humaari team availability check karke confirm karegi.";
    }

    return response;
  }
};
