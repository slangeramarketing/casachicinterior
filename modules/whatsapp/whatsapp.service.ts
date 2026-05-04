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
import fs from "fs";
import path from "path";
import { whatsappIntent } from "./whatsapp.intent";
import { whatsappMemory } from "./whatsapp.memory";
import { whatsappLead } from "./whatsapp.lead";
import { whatsappTemplates } from "./whatsapp.templates";
import { whatsappPrompt } from "./whatsapp.prompt";
import { leadService } from "../leads/lead.service";
import { whatsappUtils } from "./whatsapp.utils";

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
    try {
      console.log(`\n[WhatsApp] Incoming Message from ${fromNumber}: "${originalMessage}"`);

      // STEP 1: Detect intent
      const intent = whatsappIntent.detect(originalMessage);

      // (NEW) Persist lead message & intent to DB
      await leadService.upsertLead({
        phone: fromNumber,
        message: `User: ${originalMessage}`,
        intent: intent
      });

      // STEP 2: Get lead data
      const lead = await leadService.getLeadByPhone(fromNumber);

      const missingFields: string[] = [];
      if (!lead?.name) missingFields.push("name");
      if (!lead?.location) missingFields.push("location");
      if (!lead?.requirement) missingFields.push("requirement");

      const language = whatsappUtils.detectLanguage(originalMessage);

      // STEP 3: Save user message in memory
      whatsappMemory.add(fromNumber, `User: ${originalMessage}`);
      const history = whatsappMemory.get(fromNumber);

      // Apply hard control: If missing name and not first interaction, clear forcing
      const isFirstInteraction = history.length <= 1;
      let finalMissingFields = [...missingFields];
      if (missingFields.includes("name") && !isFirstInteraction) {
        finalMissingFields = []; // Let AI decide naturally
      }

      let finalResponse = "";

      // STEP 4: Handle template shortcut
      if (intent === "pricing") {
        console.log(`[WhatsApp] Intent detected as 'pricing', using template shortcut.`);
        finalResponse = whatsappTemplates.pricing;
      } else if (finalMissingFields.length > 0) {
        // STEP 5: SERVICE LEVEL HARD CONTROL (Direct Response Mode)
        console.log(`[WhatsApp] Hard control triggered for missing fields: ${finalMissingFields.join(", ")}`);
        
        if (finalMissingFields.includes("name")) {
          finalResponse = language === "hinglish" ? "Aapka naam kya hai?" : "May I know your name please?";
        } else if (finalMissingFields.includes("location")) {
          finalResponse = language === "hinglish" ? "Aapka location kya hai?" : "What is your location?";
        } else if (finalMissingFields.includes("requirement")) {
          finalResponse = language === "hinglish" ? "Aap kis type ka interior plan kar rahe hain?" : "What type of interior are you planning?";
        }
      } else {
        // STEP 6: Build dynamic prompt and call AI
        const infoPath = path.join(process.cwd(), "data", "casachic-info.json");
        let businessInfo = {};
        if (fs.existsSync(infoPath)) {
          businessInfo = JSON.parse(fs.readFileSync(infoPath, "utf-8"));
        }

        const systemPrompt = whatsappPrompt.build({
          lead,
          history,
          businessInfo,
          missingFields: finalMissingFields,
          language
        });

        // STEP 6: Call AI (USE EXISTING NVIDIA SETUP)
        try {
          const completion = await nvidiaOpenai.chat.completions.create({
            model: "meta/llama-4-maverick-17b-128e-instruct",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: originalMessage }
            ],
            temperature: 0.6,
            max_tokens: 800,
          });

          const messageResult = completion.choices[0]?.message;

          // @ts-ignore
          const reasoning = messageResult?.reasoning_content;
          console.log("[WhatsApp] AI Thinking Process:", reasoning || "No reasoning content present");

          finalResponse = messageResult?.content || "";
          
          if (!finalResponse || finalResponse.trim() === "") {
            throw new Error("Empty response from AI");
          }

          // STEP 7: RESPONSE TRIM SAFETY (EXTRA PROTECTION)
          if (finalResponse.length > 200) {
            finalResponse = finalResponse.split(".")[0];
          }
        } catch (aiError) {
          console.error("[WhatsApp] AI Call Error:", aiError);
          finalResponse = "Thoda issue aa raha hai. Aap apna requirement share karein, team connect karegi.";
        }
      }

      // STEP 7: Save AI response to memory
      whatsappMemory.add(fromNumber, `Bot: ${finalResponse}`);
      
      // (NEW) Save bot message to DB
      await leadService.upsertLead({
        phone: fromNumber,
        message: `Bot: ${finalResponse}`
      });
      
      console.log(`[WhatsApp] Generated Response for ${fromNumber}: "${finalResponse}"\n`);

      // STEP 8: Send response via Meta API (existing logic)
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

      const metaResponse = await fetch(metaApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${whatsappToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!metaResponse.ok) {
        const errorData = await metaResponse.json();
        console.error("Meta API Error:", errorData);
      } else {
        console.log(`Successfully replied to WhatsApp number ${fromNumber}`);
      }

    } catch (error) {
      console.error("Error processing WhatsApp message via Nvidia/Meta:", error);
    }
  }
};
