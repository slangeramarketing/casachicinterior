/***************************************************
 * File: modules/whatsapp/whatsapp.controller.ts
 * Layer: Controller
 *
 * Purpose:
 * - Handles the Meta Webhook logic for WhatsApp
 *
 * Responsibilities:
 * - Verify the webhook (GET)
 * - Parse incoming message payloads (POST)
 * - Delegate strictly business logic to the service layer
 *
 * Restrictions:
 * - Must NOT perform deep AI logic or fetch Meta APIs directly
 ***************************************************/
import { whatsappService } from "./whatsapp.service";

export const whatsappController = {
  /**
   * Purpose:
   * - Verifies the Meta Webhook connection challenge
   *
   * Used By:
   * - API Route (GET /api/whatsapp)
   *
   * Returns:
   * - The expected challenge string or null if unauthorized
   *
   * Notes:
   * - Meta token must match process.env.WHATSAPP_VERIFY_TOKEN
   */
  verifyWebhook(mode: string | null, token: string | null, challenge: string | null): string | null {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "casa_chic_verify_123";

    if (mode === "subscribe" && token === verifyToken) {
      console.log("WHATSAPP WEBHOOK_VERIFIED");
      return challenge;
    }
    return null;
  },

  /**
   * Purpose:
   * - Parses webhook POST payloads containing incoming WhatsApp messages
   *
   * Used By:
   * - API Route (POST /api/whatsapp)
   *
   * Returns:
   * - Promise<void>
   *
   * Notes:
   * - Immediately extracts the core message text and dispatches to the service
   */
  async handleWebhookPayload(payload: any): Promise<void> {
    if (payload.object !== "whatsapp_business_account") return;

    if (payload.entry && payload.entry.length > 0) {
      for (const entry of payload.entry) {
        if (entry.changes && entry.changes.length > 0) {
          const change = entry.changes[0].value;

          if (change.messages && change.messages.length > 0) {
            const messageObj = change.messages[0];
            const phoneNumberId = change.metadata.phone_number_id;
            const fromNumber = messageObj.from;
            
            let userMessageText = "";
            if (messageObj.type === "text") {
              userMessageText = messageObj.text.body;
            } else {
              userMessageText = `[User sent a media/interactive ${messageObj.type} message]`;
            }

            // We do NOT await here. The webhook must return 200 OK immediately.
            whatsappService.processIncomingMessage(phoneNumberId, fromNumber, userMessageText)
              .catch(err => {
                 console.error("Error dispatched in async processIncomingMessage:", err);
              });
          }
        }
      }
    }
  }
};
