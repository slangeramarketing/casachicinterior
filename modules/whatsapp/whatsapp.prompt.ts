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
  businessInfo: any;
  missingFields: string[];
  language: "hinglish" | "english";
}

export const whatsappPrompt = {
  /**
   * Purpose: Constructs the final system prompt string for the Nvidia/OpenAI call
   * @param options Object containing lead, history, and business info
   */
  build(options: PromptOptions): string {
    const { lead, history, businessInfo, missingFields, language } = options;

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

Example Style:
GOOD:
"Nice 👍
Aapka location kya hai?"

BAD:
"Kitchen design is very exciting and we offer multiple solutions..."`;

    const bName = businessInfo?.business_info?.name || "CasaChic Interior";
    const bProjects = businessInfo?.trust_stats?.projects_delivered || "150+";
    const bExp = businessInfo?.trust_stats?.years_experience || "5+";
    const bLocs = (businessInfo?.locations?.service_areas || ["Noida", "Delhi NCR"]).slice(0, 3).join(", ");
    
    // Extract max 2 services dynamically
    const servicesObj = businessInfo?.services || {};
    const extractedServices = Object.keys(servicesObj).slice(0, 2).map(s => s.replace(/_/g, " ")).join(", ") || "Modular Kitchen, Home Interior";

    const filteredBusinessContext = `Business:
- ${bName}
- ${bProjects} projects, ${bExp} years experience
- Locations: ${bLocs}
- Services: ${extractedServices}`;

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
