/***************************************************
 * File: modules/whatsapp/whatsapp.prompt.ts
 * Layer: Helper / Internal
 *
 * Purpose:
 * - Builds dynamic system prompts for the LLM
 *
 * Responsibilities:
 * - Combine business context, lead profile, and conversation history
 * - Enforce strict LLM behavioral rules (Hinglish, short length, no direct pricing)
 ***************************************************/

import { LeadProfile } from "./whatsapp.lead";

export interface PromptOptions {
  lead?: any;
  history: string[];
  context: any; 
  verifiedUrl?: string | null;
  websiteUrl: string;
  conversationState: any;
  missingFields: string[];
  language: "hinglish" | "english";
}

export const whatsappPrompt = {
  /**
   * Purpose: Constructs the final system prompt string for the Nvidia/OpenAI call
   * @param options Object containing lead, history, context, and verified URL
   */
  build(options: PromptOptions): string {
    const { lead, history, context, verifiedUrl, websiteUrl, conversationState, missingFields, language } = options;

    const BASE_PROMPT = `You are a professional Interior Design Consultant for CasaChic Interior.
    
Response Quality Rules:
* Sound human and helpful, not robotic or scripted.
* Answer the user's specific question FIRST.
* Maximum 2 lines per reply.
* Break response into short WhatsApp-style sentences.
* Use simple conversational Hinglish (mixed Hindi/English) or English as requested.
* Do NOT ask irrelevant follow-up questions.
* If a question was already asked (see Conversation State), do NOT ask it again.

STRICT URL & PORTFOLIO RULES:
* NEVER say "website unavailable" or "no portfolio".
* ALWAYS use the provided Website or Verified Link if the user asks for samples/work/website.
* If user asks for work samples, mention the Verified Link naturally.
* If NO Verified Link is provided, use the Website Link as fallback.

STRICT SCHEDULING RULES:
* NEVER confirm a meeting or promise a specific time slot (e.g., "11 AM is confirmed").
* NEVER say "your appointment is booked" or "see you tomorrow".
* NEVER ask the user to bring any documents or materials.
* ALWAYS say: "Please share your preferred date and time, our team will confirm the availability."
* If user gives a time, say: "Noted, team will check and confirm with you shortly."

Example Style:
GOOD:
"Hum premium brands like CenturyPly aur Greenply use karte hain. 👍
Kya aap kisi specific style ka interior plan kar rahe hain?"

BAD (Operational Hallucination):
"Kal 11 baje meeting confirm hai. Aap documents le aaiyega."

BAD (Aggressive):
"Ham CenturyPly use karte hain. Aapka kitchen size kya hai? Budget kitna hai?"`;

    // Extract basic info from business context
    const business = context.business?.business_info || {};
    const stats = context.business?.trust_stats || {};
    const locations = context.business?.locations?.service_areas || ["Noida", "Delhi NCR"];
    
    const bName = business.name || "CasaChic Interior";
    const bProjects = stats.projects_delivered || "150+";
    const bExp = stats.years_experience || "5+";
    const bLocs = locations.slice(0, 3).join(", ");

    let extraContext = "";

    // Dynamically add relevant info if available in context
    if (context.services) {
      const services = Object.keys(context.services.services || {}).slice(0, 3).map(s => s.replace(/_/g, " ")).join(", ");
      extraContext += `\nServices: ${services}`;
    }

    if (context.pricing) {
      extraContext += `\nPricing: Provide approximate ranges only. Exact cost after site visit.`;
    }

    if (context.materials) {
      const brands = context.materials.wood_and_boards?.brands?.join(", ") || "CenturyPly, Greenply";
      extraContext += `\nMaterials: Using premium brands like ${brands}.`;
    }

    if (context.faq) {
      extraContext += `\nFAQ: Answer common questions based on business standards.`;
    }

    const filteredBusinessContext = `Business:
- ${bName}
- ${bProjects} projects, ${bExp} years experience
- Locations: ${bLocs}${extraContext}`;

    const userContext = `User:
- Name: ${lead?.name || "unknown"}
- Location: ${lead?.location || "unknown"}
- Requirement: ${lead?.requirement || "unknown"}`;

    const historyStr = history.length > 0 
      ? history.join("\n") 
      : "No prior history.";

    const missingStr = missingFields.length > 0 ? missingFields.join(", ") : "none";

    return `${BASE_PROMPT}

Website Link: ${websiteUrl}
Verified Link: ${verifiedUrl || "NONE"}

Conversation State (Already Discussed/Asked):
${JSON.stringify(conversationState, null, 2)}

Language: ${language}
Rules:
* If language is hinglish -> reply in Hinglish
* If language is english -> reply in English

Missing Info:
${missingStr}
Rules:
* Ask ONLY for missing information
* If nothing is missing -> DO NOT ask questions
* NEVER repeat questions mentioned in Conversation State as "true"
* If user already provided info -> use it naturally
* Do not ask the same question twice under any condition.

${filteredBusinessContext}

${userContext}

Recent History:
${historyStr}`;
  }
};
