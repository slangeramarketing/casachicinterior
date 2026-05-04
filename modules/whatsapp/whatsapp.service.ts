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
    try {
      console.log(`\n[WhatsApp] Incoming Message from ${fromNumber}: "${originalMessage}"`);

      // STEP 1: Detect intent
      const intent = whatsappIntent.detect(originalMessage);

      // Fetch lead early for memory consistency
      const existingLead = await leadService.getLeadByPhone(fromNumber);

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
        intent: intent
      };

      if (name) updatePayload.name = name;
      if (location) updatePayload.location = location;
      if (requirement) updatePayload.requirement = requirement;

      console.log("Extracted:", { name, location, requirement });
      console.log("Saving Payload:", updatePayload);

      // (NEW) Persist lead message & intent to DB
      await leadService.upsertLead(updatePayload);

      // STEP 2: Get updated lead data for flow control
      const lead = await leadService.getLeadByPhone(fromNumber);

      const language = whatsappUtils.detectLanguage(originalMessage);

      // STEP 3: Save user message in memory
      whatsappMemory.add(fromNumber, `User: ${originalMessage}`);
      const history = whatsappMemory.get(fromNumber);

      let finalResponse = "";

      // STEP 4: Handle template shortcut
      if (intent === "pricing") {
        console.log(`[WhatsApp] Intent detected as 'pricing', using template shortcut.`);
        finalResponse = whatsappTemplates.pricing;
      } else if (!lead?.name) {
        console.log(`[WhatsApp] Strict Flow: Asking for name`);
        finalResponse = language === "hinglish" ? "Aapka naam kya hai?" : "May I know your name please?";
      } else if (!lead?.location) {
        console.log(`[WhatsApp] Strict Flow: Asking for location`);
        finalResponse = language === "hinglish" ? "Aapka location kya hai?" : "What is your location?";
      } else if (!lead?.requirement) {
        console.log(`[WhatsApp] Strict Flow: Asking for requirement`);
        finalResponse = language === "hinglish" ? "Aap kis type ka interior plan kar rahe hain?" : "What type of interior are you planning?";
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
          missingFields: [], // No longer using dynamic missing fields array
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

          // HARD FILTER: Remove any AI hallucinated URLs completely
          finalResponse = finalResponse.replace(/https?:\/\/\S+/g, "");

          // STEP 7: RESPONSE TRIM SAFETY (EXTRA PROTECTION)
          if (finalResponse.length > 200) {
            finalResponse = finalResponse.split(".")[0];
          }
        } catch (aiError) {
          console.error("[WhatsApp] AI Call Error:", aiError);
          finalResponse = "Thoda issue aa raha hai. Aap apna requirement share karein, team connect karegi.";
        }
      }

      // STEP 7: Append Portfolio Link if applicable
      const activeRequirement = requirement || lead?.requirement;
      const portfolioLink = activeRequirement ? whatsappPortfolio.getLink(activeRequirement) : null;
      let shouldMarkPortfolioSent = false;

      if (portfolioLink && !lead?.portfolioSent) {
        finalResponse += `\n\nDesigns dekh lo 👇\n${portfolioLink}`;
        shouldMarkPortfolioSent = true;
      }

      // STEP 8: Save AI response to memory
      whatsappMemory.add(fromNumber, `Bot: ${finalResponse}`);
      
      // (NEW) Save bot message to DB
      const botPayload: any = {
        phone: fromNumber,
        message: `Bot: ${finalResponse}`
      };
      if (shouldMarkPortfolioSent) botPayload.portfolioSent = true;
      
      await leadService.upsertLead(botPayload);
      
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
