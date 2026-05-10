/***************************************************
 * File: modules/whatsapp/whatsapp.context.ts
 * Layer: Helper / Internal
 *
 * Purpose:
 * - Dynamically loads and builds relevant business context for the AI
 *
 * Responsibilities:
 * - Select JSON files based on detected intents
 * - Implement in-memory caching to avoid repeated FS reads
 * - Build a compact context object for the prompt
 ***************************************************/

import fs from "fs/promises";
import path from "path";
import { WhatsappIntent, whatsappIntent } from "./whatsapp.intent";

// In-memory cache for JSON files
const cache = new Map<string, any>();

// Mapping of intents to required JSON files
const intentFileMap: Record<WhatsappIntent, string[]> = {
  greeting: ["conversation.json", "business.json"],
  pricing: ["pricing.json", "services.json", "faq.json"],
  materials: ["materials.json", "faq.json"],
  plywood: ["materials.json", "faq.json"],
  laminate: ["materials.json", "faq.json"],
  hardware: ["materials.json", "faq.json"],
  tiles: ["materials.json", "faq.json"],
  sanitary: ["materials.json", "faq.json"],
  kitchen: ["services.json", "pricing.json", "faq.json"],
  wardrobe: ["services.json", "pricing.json", "faq.json"],
  renovation: ["services.json", "faq.json"],
  commercial: ["services.json", "business.json"],
  residential: ["services.json", "business.json"],
  location: ["business.json"],
  consultation: ["lead-rules.json", "business.json"],
  budget: ["pricing.json", "objections.json"],
  objection_price: ["objections.json", "pricing.json"],
  objection_delay: ["objections.json"],
  faq: ["faq.json", "business.json"],
  unknown: ["business.json", "services.json"]
};

export const whatsappContext = {
  /**
   * Purpose: Builds the full context for a given message
   * @param message Raw message from user
   * @returns Optimized context object
   */
  async buildContext(message: string): Promise<any> {
    const intents = whatsappIntent.detect(message);
    console.log(`[WhatsApp Context] Detected Intents: ${intents.join(", ")}`);
    
    return await this.loadRelevantFiles(intents);
  },

  /**
   * Purpose: Loads only the relevant JSON files based on intents
   * @param intents Array of detected intents
   */
  async loadRelevantFiles(intents: WhatsappIntent[]): Promise<any> {
    const filesToLoad = new Set<string>();
    
    // Always include business info as a base if not explicitly excluded
    filesToLoad.add("business.json");

    intents.forEach(intent => {
      const files = intentFileMap[intent];
      if (files) {
        files.forEach(file => filesToLoad.add(file));
      }
    });

    const context: any = {};
    const dataDir = path.join(process.cwd(), "data");

    const loadPromises = Array.from(filesToLoad).map(async (fileName) => {
      try {
        const filePath = path.join(dataDir, fileName);
        
        // Check cache first
        if (cache.has(fileName)) {
          context[fileName.replace(".json", "")] = cache.get(fileName);
          return;
        }

        // Read from disk
        const content = await fs.readFile(filePath, "utf-8");
        const parsed = JSON.parse(content);
        
        // Save to cache
        cache.set(fileName, parsed);
        context[fileName.replace(".json", "")] = parsed;
      } catch (error) {
        console.error(`[WhatsApp Context] Failed to load ${fileName}:`, error);
      }
    });

    await Promise.all(loadPromises);

    return context;
  },

  /**
   * Purpose: Matches user message against keywords in portfolio-links.json
   * @param message Raw message from user
   * @returns Verified URL or null
   */
  async getVerifiedUrl(message: string): Promise<string | null> {
    const lowerMessage = message.toLowerCase();
    
    try {
      const dataDir = path.join(process.cwd(), "data");
      const fileName = "portfolio-links.json";
      let data: any;

      if (cache.has(fileName)) {
        data = cache.get(fileName);
      } else {
        const filePath = path.join(dataDir, fileName);
        const content = await fs.readFile(filePath, "utf-8");
        data = JSON.parse(content);
        cache.set(fileName, data);
      }

      // Check services for keyword matches
      const services = data.services || {};
      for (const key in services) {
        const service = services[key];
        const keywords = service.keywords || [];
        
        // Match if any keyword is found in the message
        const match = keywords.some((kw: string) => lowerMessage.includes(kw.toLowerCase()));
        if (match) {
          return service.url;
        }
      }

      // Check "about" as fallback
      if (lowerMessage.match(/(about|company|who are you|profile|kya hai)/)) {
        return data.about?.url || null;
      }

    } catch (error) {
      console.error("[WhatsApp Context] Error matching verified URL:", error);
    }

    return null;
  },

  /**
   * Purpose: Clears the in-memory cache (useful for updates/reloads)
   */
  clearCache(): void {
    cache.clear();
    console.log("[WhatsApp Context] Cache cleared.");
  }
};
