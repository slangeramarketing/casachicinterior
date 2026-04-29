/***************************************************
 * File: modules/whatsapp/whatsapp.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Implements processIncomingMessage using Nvidia DeepSeek-R1 API via OpenAI SDK
 *
 * Responsibilities:
 * - Call DeepSeek-R1 to process incoming WhatsApp messages
 * - Format prompts and parse reasoning
 * - Call Meta Cloud API to send WhatsApp responses back
 *
 * Restrictions:
 * - Must NOT handle Next.js HTTP Request/Response objects directly
 * - Must NOT return HTTP status codes
 ***************************************************/
import OpenAI from "openai";
import fs from "fs";
import path from "path";

export const generateSystemPrompt = (businessInfo: any) => `You are CasaChic's Lead Designer. Use the provided business info to answer queries. Be polite, professional, and try to book a site visit.

Business Information:
${JSON.stringify(businessInfo, null, 2)}

Personality Rules:
- Identity: You are the Lead Design Assistant at CasaChic Interior.
- Tone: Professional, creative, and welcoming. Speak in Hinglish (Hindi + English).
- Expertise: We specialize in Modern, Luxury, and Minimalist styles. Always refer the user to 'casachicinterior.com' for our portfolio.
- Strategy:
  1. If the user is new, politely ask for their name and location.
  2. If they ask for prices or cost, explain that interior design is highly custom, so we need a 'Site Visit' before providing a quote.
  3. Always try to encourage them to book a consultation or site visit.
  4. Keep WhatsApp replies concise (under 100 words).
  5. Agar user koi complex sawal puche toh use bolo ki hamara expert aapko call karega.
- Formatting: Use bullet points for design suggestions or steps to make it highly readable on mobile phones.`;

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

      // Read Business Context
      const infoPath = path.join(process.cwd(), "data", "casachic-info.json");
      let businessInfo = {};
      if (fs.existsSync(infoPath)) {
        businessInfo = JSON.parse(fs.readFileSync(infoPath, "utf-8"));
      }
      
      const systemPrompt = generateSystemPrompt(businessInfo);

      // 1. Send the message to Nvidia Llama-4
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

      // 2. Extract Reasoning Process for Internal Logging
      // @ts-ignore - The standard OpenAI SDK typings may not include reasoning_content natively depending on version
      const reasoning = messageResult?.reasoning_content;
      console.log("[WhatsApp] AI Thinking Process:", reasoning || "No reasoning content present");

      // 3. Extract the Final Response for WhatsApp
      let finalResponse = messageResult?.content;
      if (!finalResponse || finalResponse.trim() === "") {
        finalResponse = "We encountered a momentary issue processing your request. Please try again or contact us directly on our website!";
      }

      console.log(`[WhatsApp] Generated Response for ${fromNumber}: "${finalResponse}"\n`);

      // 4. Send the response back to WhatsApp via Meta Cloud API
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
