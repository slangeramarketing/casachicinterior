import OpenAI from "openai";
import { aiRepository } from "./ai.repository";
import { aiCrypto } from "./ai.crypto";

// Static estimation of costs per 1M tokens (in USD)
// Llama-4 Maverick 17B (Nvidia): $0.50 per 1M tokens
// Meta Llama 3 70B: $0.88 per 1M tokens
const COST_PER_MILLION_TOKENS: Record<string, number> = {
  "meta/llama-4-maverick-17b-128e-instruct": 0.50,
  "meta/llama3-70b-instruct": 0.88,
  // Add more fallback mapping here
};

export const aiService = {
  /**
   * Fetches the active provider from DB, decrypts the key, 
   * and returns an initialized OpenAI client.
   */
  async providerResolver(): Promise<{ client: OpenAI; model: string; providerName: string }> {
    const settings = await aiRepository.getSettings();
    if (settings.isAiPaused) {
      throw new Error("AI_GLOBALLY_PAUSED");
    }

    const activeProvider = await aiRepository.getActiveProvider();
    
    if (!activeProvider) {
      throw new Error("No active AI Provider configured in the dashboard.");
    }

    const decryptedKey = aiCrypto.decrypt(activeProvider.encryptedKey);
    if (!decryptedKey) {
      throw new Error(`Failed to decrypt API key for provider: ${activeProvider.provider}`);
    }

    let baseURL: string | undefined;
    if (activeProvider.provider === "Nvidia") {
      baseURL = "https://integrate.api.nvidia.com/v1";
    } else if (activeProvider.provider === "OpenRouter") {
      baseURL = "https://openrouter.ai/api/v1";
    }

    const client = new OpenAI({
      apiKey: decryptedKey,
      baseURL
    });

    return { 
      client, 
      model: activeProvider.model, 
      providerName: activeProvider.provider 
    };
  },

  /**
   * Intercepts and logs usage after an LLM call
   */
  async logUsage(params: {
    phone: string;
    provider: string;
    model: string;
    providerReportedTokens: number;
    estimatedTokens: number;
    latency: number; // ms
    success: boolean;
  }) {
    const totalTokens = Math.max(params.providerReportedTokens, params.estimatedTokens);
    
    // Calculate cost
    let estimatedCost = 0;
    const rate = COST_PER_MILLION_TOKENS[params.model];
    if (rate) {
      estimatedCost = (totalTokens / 1_000_000) * rate;
    }

    await aiRepository.logUsage({
      ...params,
      estimatedCost
    });
  },

  /**
   * Check if limits are exceeded before a call
   */
  async checkLimits(providerName: string, phone: string): Promise<boolean> {
    const provider = await aiRepository.getProviderByName(providerName);
    if (!provider) {
      console.error(`[checkLimits] Provider not found: ${providerName}`);
      return false;
    }

    // Check Expiry
    if (provider.expiresAt && provider.expiresAt < new Date()) {
      console.error(`[checkLimits] API Key Expired for ${providerName}. Expiry: ${provider.expiresAt}`);
      await aiRepository.logLimitEvent({ provider: providerName, phone, reason: "API Key Expired", limitType: "EXPIRY" });
      return false; // Block
    }

    // Check Daily Limit
    if (provider.dailyLimit && provider.dailyLimit > 0) {
      const todayTokens = await aiRepository.getUsageStatsToday();
      if (todayTokens >= provider.dailyLimit) {
         console.error(`[checkLimits] Daily Token Limit Exceeded. Used: ${todayTokens}, Limit: ${provider.dailyLimit}`);
         await aiRepository.logLimitEvent({ provider: providerName, phone, reason: "Daily Token Limit Exceeded", limitType: "DAILY", usage: todayTokens, limit: provider.dailyLimit });
         return false;
      }
    }

    // Check Monthly Limit
    if (provider.monthlyLimit && provider.monthlyLimit > 0) {
      const monthTokens = await aiRepository.getUsageStatsThisMonth();
      if (monthTokens >= provider.monthlyLimit) {
         console.error(`[checkLimits] Monthly Token Limit Exceeded. Used: ${monthTokens}, Limit: ${provider.monthlyLimit}`);
         await aiRepository.logLimitEvent({ provider: providerName, phone, reason: "Monthly Token Limit Exceeded", limitType: "MONTHLY", usage: monthTokens, limit: provider.monthlyLimit });
         return false;
      }
    }

    return true; // Allowed
  }
};
