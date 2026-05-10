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
  context: any; // Dynamic context from whatsapp.context.ts
  verifiedUrl?: string | null; // Matched URL from portfolio-links.json
  missingFields: string[];
  language: "hinglish" | "english";
}

export const whatsappPrompt = {
  /**
   * Purpose: Constructs the final system prompt string for the Nvidia/OpenAI call
   * @param options Object containing lead, history, context, and verified URL
   */
  build(options: PromptOptions): string {
    const { lead, history, context, verifiedUrl, missingFields, language } = options;

    const BASE_PROMPT = `You are CasaChic Interior sales assistant.

Response Rules:
* Maximum 2 lines per reply
* Maximum 15–20 words
* No paragraphs
* No long explanations
* Break response into short WhatsApp-style sentences
* Use simple conversational language
* Avoid professional/marketing tone
* Avoid long sentences
* Do NOT explain services unless asked
* Do NOT list features
* Do NOT give long descriptions
* Answer directly
* Ask next question quickly
* Keep conversation moving

STRICT URL RULES:
* NEVER generate, guess, or modify any URL.
* NEVER create website paths or slugs (e.g., /kitchen, /contact).
* NEVER mention any website unless a "Verified Link" is provided below.
* Use ONLY the "Verified Link" exactly as provided.
* If "Verified Link" is provided, mention it naturally (e.g., "Designs yaha dekh sakte ho: [link]").
* If NO "Verified Link" is provided, do NOT mention any link or website.
* Do not use placeholders like [link] or your-website.com.

Example Style:
GOOD:
"Nice 👍
Aapka location kya hai?"

BAD:
"Kitchen design is very exciting and we offer multiple solutions..."`;

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

    // Inject Verified URL if provided
    const urlContext = verifiedUrl ? `\nVerified Link: ${verifiedUrl}` : "\nVerified Link: NONE (Do NOT mention any link)";

    const filteredBusinessContext = `Business:
- ${bName}
- ${bProjects} projects, ${bExp} years experience
- Locations: ${bLocs}${extraContext}${urlContext}`;

    const userContext = `User:
- Name: ${lead?.name || "unknown"}
- Location: ${lead?.location || "unknown"}
- Requirement: ${lead?.requirement || "unknown"}`;

    const historyStr = history.length > 0 
      ? history.join("\n") 
      : "No prior history.";

    const missingStr = missingFields.length > 0 ? missingFields.join(", ") : "none";

    return `${BASE_PROMPT}

Language: ${language}
Rules:
* If language is hinglish -> reply in Hinglish
* If language is english -> reply in English

Missing Info:
${missingStr}
Rules:
* Ask ONLY for missing information
* If nothing is missing -> DO NOT ask questions
* NEVER repeat questions
* If user already provided info -> use it naturally
* Do not ask the same question twice under any condition.

${filteredBusinessContext}

${userContext}

Recent History:
${historyStr}`;
  }
};
