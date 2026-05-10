/***************************************************
 * File: modules/whatsapp/whatsapp.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Orchestrates the WhatsApp AI lead conversion engine
 *
 * Responsibilities:
 * - Detect intent and handle template shortcuts
 * - Track user history and lead profile state in-memory
 * - Dynamically generate prompts and call Nvidia Llama-4
 * - Send responses back via Meta Cloud API
 *
 * Restrictions:
 * - Must NOT handle Next.js HTTP Request/Response objects directly
 * - Must NOT return HTTP status codes
 ***************************************************/
import OpenAI from "openai";
import { whatsappIntent } from "./whatsapp.intent";
import { whatsappContext } from "./whatsapp.context";
import { whatsappMemory } from "./whatsapp.memory";
import { whatsappLead } from "./whatsapp.lead";
import { whatsappTemplates } from "./whatsapp.templates";
import { whatsappPrompt } from "./whatsapp.prompt";
import { leadService } from "../leads/lead.service";
import { whatsappUtils } from "./whatsapp.utils";
import { whatsappPortfolio } from "./whatsapp.portfolio";

const nvidiaOpenai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "NVIDIA_API_KEY_MISSING",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export const whatsappService = {
  /**
   * Purpose:
   * - Processes the incoming WhatsApp message, gets AI response, and sends it back.
   *
   * Used By:
   * - Controller (whatsapp.controller.ts)
   *
   * Returns:
   * - Promise<void>
   *
   * Notes:
   * - Nvidia API call can take time; execute asynchronously
   * - Reasoning content is logged for debugging purposes
   */
  async processIncomingMessage(phoneNumberId: string, fromNumber: string, originalMessage: string): Promise<void> {
    const totalStartTime = performance.now();
    try {
      console.log(`\n[WhatsApp] Incoming Message from ${fromNumber}: "${originalMessage}"`);

      // STEP 1: Detect intent
      const intents = whatsappIntent.detect(originalMessage);
      const primaryIntent = intents[0] || "unknown";
      console.log(`[Intent] Detected intents: ${intents.join(", ") || "none"}`);

      // STEP 1.1: Database Connection check (redundant but safe)
      const dbStartTime = performance.now();
      // Fetch lead early for memory consistency
      const existingLead = await leadService.getLeadByPhone(fromNumber);
      const dbEndTime = performance.now();
      console.log(`[DB] Fetch lead time: ${(dbEndTime - dbStartTime).toFixed(2)}ms`);

      // STEP 1.5: Improve Extraction Logic
      let name: string | undefined;
      let location: string | undefined;
      let requirement: string | undefined;

      const messageLower = originalMessage.toLowerCase().trim();

      if (messageLower === "hello" || messageLower === "hi") {
        name = undefined;
      } else if (messageLower.includes("my name is")) {
        name = originalMessage.toLowerCase().split("is")[1]?.trim();
      } else if (messageLower.startsWith("i am")) {
        name = originalMessage.toLowerCase().replace(/i am/i, "").trim();
      } else if (
        !existingLead?.name &&
        originalMessage.trim().split(" ").length === 1 &&
        originalMessage.length <= 15 &&
        !["patna", "delhi", "noida", "gurgaon", "kitchen", "bedroom", "office"].includes(messageLower)
      ) {
        name = originalMessage.trim();
      }

      const cities = ["noida", "delhi", "gurgaon", "patna"];
      for (const city of cities) {
        if (messageLower.includes(city)) {
          location = city.charAt(0).toUpperCase() + city.slice(1);
        }
      }

      if (messageLower.includes("kitchen") || messageLower.includes("wardrobe") || messageLower.includes("interior")) {
        requirement = originalMessage.trim();
      }

      // STEP 1.6: Fix Payload Building
      const updatePayload: any = {
        phone: fromNumber,
        message: `User: ${originalMessage}`,
        intent: primaryIntent
      };

      if (name) updatePayload.name = name;
      if (location) updatePayload.location = location;
      if (requirement) updatePayload.requirement = requirement;

      if (name || location || requirement) {
        console.log(`[Lead] Extracted Data:`, { name, location, requirement });
      }

      // (NEW) Persist lead message & intent to DB
      await leadService.upsertLead(updatePayload);

      // STEP 2: Get updated lead data for flow control
      const lead = await leadService.getLeadByPhone(fromNumber);
      const conversationState = lead?.conversationState || {
        askedStyle: false,
        askedBudget: false,
        askedKitchenSize: false,
        askedSiteVisit: false,
        sharedPortfolio: false,
        sharedWebsite: false
      };

      // STEP 2.5: Smart State Update (Detect if user already provided info)
      const stateUpdate: any = {};
      if (messageLower.match(/(modern|traditional|classic|luxury|minimalist)/)) {
        conversationState.askedStyle = true;
        stateUpdate.askedStyle = true;
      }
      if (messageLower.match(/(budget|kharcha|paisa|affordable|premium|range)/) && messageLower.match(/(\d+|lakh|thousand|k)/)) {
        conversationState.askedBudget = true;
        stateUpdate.askedBudget = true;
      }
      if (messageLower.match(/(size|sqft|area|measure|dimensions|bhk)/)) {
        conversationState.askedKitchenSize = true;
        stateUpdate.askedKitchenSize = true;
      }
      if (intents.includes("portfolio")) {
        conversationState.sharedPortfolio = true;
        stateUpdate.sharedPortfolio = true;
      }
      if (intents.includes("website")) {
        conversationState.sharedWebsite = true;
        stateUpdate.sharedWebsite = true;
      }

      if (Object.keys(stateUpdate).length > 0) {
        await leadService.upsertLead({
          phone: fromNumber,
          conversationState: { ...conversationState, ...stateUpdate }
        } as any);
      }

      const language = whatsappUtils.detectLanguage(originalMessage);

      // STEP 3: Save user message in memory
      whatsappMemory.add(fromNumber, `User: ${originalMessage}`);
      const history = whatsappMemory.get(fromNumber);

      let finalResponse = "";
      let verifiedUrl: string | null = null;
      const websiteUrl = await whatsappContext.getWebsiteUrl();

      // STEP 4: Handle template shortcut (Minimalistic)
      if (intents.includes("pricing") && !messageLower.includes("budget")) {
         // If they just ask about price without giving context, we can use the template or let AI handle.
         // Let's let AI handle for better quality unless it's a very generic "pricing" trigger.
      }

      // STEP 6: Build dynamic prompt and call AI
      const contextStartTime = performance.now();
      const context = await whatsappContext.buildContext(originalMessage);
      verifiedUrl = await whatsappContext.getVerifiedUrl(originalMessage);
      const contextEndTime = performance.now();
      
      console.log(`[Context] Context built in ${(contextEndTime - contextStartTime).toFixed(2)}ms`);

      const systemPrompt = whatsappPrompt.build({
        lead,
        history,
        context,
        verifiedUrl,
        websiteUrl,
        conversationState,
        missingFields: [], 
        language
      });

      console.log(`[Prompt] Prompt length: ${systemPrompt.length} chars`);

      // STEP 6: Call AI (USE EXISTING NVIDIA SETUP)
      try {
        console.log(`[AI] Sending request to Nvidia API...`);
        const aiStartTime = performance.now();
        const completion = await nvidiaOpenai.chat.completions.create({
          model: "meta/llama-4-maverick-17b-128e-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: originalMessage }
          ],
          temperature: 0.6,
          max_tokens: 800,
        });
        const aiEndTime = performance.now();
        console.log(`[AI] Response generated in ${(aiEndTime - aiStartTime).toFixed(2)}ms`);

        const messageResult = completion.choices[0]?.message;
        finalResponse = messageResult?.content || "";

        if (!finalResponse || finalResponse.trim() === "") {
          throw new Error("Empty response from AI");
        }

        // DETERMINISTIC INJECTION (BACKEND ENFORCEMENT)
        if (intents.includes("portfolio") || intents.includes("website")) {
          if (!finalResponse.includes("https://")) {
             const link = verifiedUrl || websiteUrl;
             finalResponse += `\n\nAap humara kaam yaha dekh sakte hain: ${link}`;
          }
        }

        // DETERMINISTIC SAFETY LAYER (POST-PROCESSING)
        finalResponse = whatsappUtils.sanitizeSchedulingClaims(finalResponse);

        // RESPONSE TRIM SAFETY (EXTRA PROTECTION)
        if (finalResponse.length > 300) {
          finalResponse = finalResponse.substring(0, 300);
        }

      } catch (aiError: any) {
        console.error(`[WhatsApp Service] AI Call Failed: ${aiError.message}`);
        finalResponse = "Thoda issue aa raha hai. Aap apna requirement share karein, team connect karegi.";
      }

      // STEP 7: Update flags based on AI response (Detect what AI asked)
      const aiResponseLower = finalResponse.toLowerCase();
      const aiStateUpdate: any = {};
      if (aiResponseLower.match(/(modern|traditional|style|look)/)) aiStateUpdate.askedStyle = true;
      if (aiResponseLower.match(/(budget|range|kharcha)/)) aiStateUpdate.askedBudget = true;
      if (aiResponseLower.match(/(size|area|measure|dimensions)/)) aiStateUpdate.askedKitchenSize = true;
      if (aiResponseLower.match(/(visit|meet|appointment|milne)/)) aiStateUpdate.askedSiteVisit = true;

      if (Object.keys(aiStateUpdate).length > 0) {
        await leadService.upsertLead({
          phone: fromNumber,
          conversationState: { ...conversationState, ...stateUpdate, ...aiStateUpdate }
        } as any);
      }

      // STEP 8: Save AI response to memory
      whatsappMemory.add(fromNumber, `Bot: ${finalResponse}`);

      // (NEW) Save bot message to DB
      const botPayload: any = {
        phone: fromNumber,
        message: `Bot: ${finalResponse}`
      };
      if (verifiedUrl && !lead?.portfolioSent) botPayload.portfolioSent = true;

      await leadService.upsertLead(botPayload);

      console.log(`[WhatsApp] Final Response for ${fromNumber}: "${finalResponse}"`);

      // STEP 8: Send response via Meta API
      const metaApiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
      const whatsappToken = process.env.WHATSAPP_TOKEN;

      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: fromNumber,
        type: "text",
        text: {
          preview_url: false,
          body: finalResponse
        }
      };

      console.log(`[Meta] Sending WhatsApp reply to ${fromNumber}...`);
      const metaStartTime = performance.now();
      const metaResponse = await fetch(metaApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${whatsappToken}`
        },
        body: JSON.stringify(payload)
      });
      const metaEndTime = performance.now();

      if (!metaResponse.ok) {
        const errorData = await metaResponse.json();
        console.error(`[Meta] API Error:`, JSON.stringify(errorData));
      } else {
        console.log(`[Meta] Message sent successfully in ${(metaEndTime - metaStartTime).toFixed(2)}ms`);
      }

      const totalEndTime = performance.now();
      console.log(`[WhatsApp] Total Request Processing Time: ${(totalEndTime - totalStartTime).toFixed(2)}ms\n`);

    } catch (error: any) {
      console.error(`[WhatsApp Service] Critical Error: ${error.message}`);
    }
  }
};


