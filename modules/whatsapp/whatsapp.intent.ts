/***************************************************
 * File: modules/whatsapp/whatsapp.intent.ts
 * Layer: Helper / Internal
 *
 * Purpose:
 * - Detects user intent from the incoming WhatsApp message
 *
 * Responsibilities:
 * - Match keywords to return specific intents
 * - Return: Array of WhatsappIntent (e.g., ["pricing", "kitchen"])
 ***************************************************/

export type WhatsappIntent =
  | "greeting"
  | "pricing"
  | "materials"
  | "plywood"
  | "laminate"
  | "hardware"
  | "tiles"
  | "sanitary"
  | "kitchen"
  | "wardrobe"
  | "renovation"
  | "commercial"
  | "residential"
  | "location"
  | "consultation"
  | "budget"
  | "objection_price"
  | "objection_delay"
  | "faq"
  | "unknown";

export const whatsappIntent = {
  /**
   * Purpose: Matches keywords to determine intent
   * @param message Raw text message from user
   * @returns Array of matching WhatsappIntent strings
   */
  detect(message: string): WhatsappIntent[] {
    const lowerMessage = message.toLowerCase();
    const intents = new Set<WhatsappIntent>();

    // Greeting
    if (lowerMessage.match(/(hi|hello|hey|namaste|good morning|hola|kaise)/)) {
      intents.add("greeting");
    }

    // Pricing / Cost
    if (lowerMessage.match(/(price|cost|charge|kitna|kitne|paisa|quote|estimate|rate|kharcha|expenditure)/)) {
      intents.add("pricing");
    }

    // Budget
    if (lowerMessage.match(/(budget|kam paisa|sasta|cheap|affordable|range)/)) {
      intents.add("budget");
    }

    // Materials / Quality
    if (lowerMessage.match(/(material|quality|brand|quality|kaunsa use|kaunsi use)/)) {
      intents.add("materials");
    }

    // Plywood / Boards
    if (lowerMessage.match(/(ply|plywood|board|hdhmr|mdf|century|greenply)/)) {
      intents.add("plywood");
      intents.add("materials");
    }

    // Laminate / Mica
    if (lowerMessage.match(/(laminate|mica|sunmica|finish|gloss|matte|merino)/)) {
      intents.add("laminate");
      intents.add("materials");
    }

    // Hardware
    if (lowerMessage.match(/(hardware|channel|hinge|hettich|hafele|inox|basket|pullout)/)) {
      intents.add("hardware");
      intents.add("materials");
    }

    // Tiles
    if (lowerMessage.match(/(tiles|floor|flooring|kajaria|varmora|marble|pathar)/)) {
      intents.add("tiles");
      intents.add("materials");
    }

    // Sanitary
    if (lowerMessage.match(/(sanitary|bath|toilet|jaquar|kohler|cera|basin|tap|faucet)/)) {
      intents.add("sanitary");
      intents.add("materials");
    }

    // Kitchen
    if (lowerMessage.match(/(kitchen|modular kitchen|rasoi|chimney|pantry)/)) {
      intents.add("kitchen");
    }

    // Wardrobe
    if (lowerMessage.match(/(wardrobe|cupboard|almirah|almari|closet)/)) {
      intents.add("wardrobe");
    }

    // Renovation
    if (lowerMessage.match(/(renovation|repair|makeover|purana|change|civil)/)) {
      intents.add("renovation");
    }

    // Commercial
    if (lowerMessage.match(/(office|shop|showroom|commercial|store|clinic|cafe|restaurant)/)) {
      intents.add("commercial");
    }

    // Residential
    if (lowerMessage.match(/(home|flat|apartment|villa|residential|makan|ghar|bungalow)/)) {
      intents.add("residential");
    }

    // Location
    if (lowerMessage.match(/(location|address|office|showroom|kaha|where|noida|delhi|gurgaon|address)/)) {
      intents.add("location");
    }

    // Consultation / Visit
    if (lowerMessage.match(/(visit|meet|appointment|milna|consultation|call|talk|discussion)/)) {
      intents.add("consultation");
    }

    // Objection Price
    if (lowerMessage.match(/(costly|expensive|mehanga|high price|bahut zyada|expensive)/)) {
      intents.add("objection_price");
    }

    // Objection Delay
    if (lowerMessage.match(/(delay|time|kab tak|how long|kitna time|duration|waqt)/)) {
      intents.add("objection_delay");
    }

    // FAQ
    if (lowerMessage.match(/(question|how|why|info|process|kaise hota|kya hota)/)) {
      intents.add("faq");
    }

    // Fallback Unknown
    if (intents.size === 0) {
      intents.add("unknown");
    }

    return Array.from(intents);
  }
};
