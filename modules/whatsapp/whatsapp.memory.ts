/***************************************************
 * File: modules/whatsapp/whatsapp.memory.ts
 * Layer: State (In-Memory)
 *
 * Purpose:
 * - Stores recent conversation history per user
 *
 * Responsibilities:
 * - Maintain Map<string, string[]> mapping phone numbers to message arrays
 * - Store maximum of 10 recent messages per user
 ***************************************************/

// In-Memory store for conversation history
const conversationStore = new Map<string, string[]>();
const MAX_HISTORY = 5;

export const whatsappMemory = {
  /**
   * Purpose: Retrieves conversation history for a specific user
   * @param userPhone The user's WhatsApp number ID
   * @returns Array of message strings
   */
  get(userPhone: string): string[] {
    return conversationStore.get(userPhone) || [];
  },

  /**
   * Purpose: Adds a new message to the user's history and trims if necessary
   * @param userPhone The user's WhatsApp number ID
   * @param message The message string (prefixed with 'User:' or 'Bot:')
   */
  add(userPhone: string, message: string): void {
    let history = conversationStore.get(userPhone) || [];
    history.push(message);

    // Keep only the last N messages
    if (history.length > MAX_HISTORY) {
      history = history.slice(history.length - MAX_HISTORY);
    }

    conversationStore.set(userPhone, history);
  }
};
