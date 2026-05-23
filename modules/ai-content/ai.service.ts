import { aiService as providerManager } from "@/modules/ai-management/ai.service";
import { buildServiceGenerationPrompt } from "./ai.prompt";
import { GeneratedServiceSchema, GeneratedServiceData } from "./ai.schema";
import { GenerateServicePromptInput } from "./ai.types";

export const aiContentService = {
  async generateService(input: GenerateServicePromptInput): Promise<GeneratedServiceData> {
    
    // 1. Get the configured AI provider
    const { client, model, providerName } = await providerManager.providerResolver();
    
    // 2. Check limits (we'll assume a generic 'system' phone identifier for admin actions)
    const systemId = "admin_ai_generator";
    const isAllowed = await providerManager.checkLimits(providerName, systemId);
    if (!isAllowed) {
      console.error(`[aiContentService] Limits exceeded for provider: ${providerName}`);
      throw new Error(`AI Limits exceeded for provider: ${providerName}. Please check your quota or increase limits.`);
    }

    // 3. Build Prompt
    const systemPrompt = buildServiceGenerationPrompt(input);
    
    const startTime = Date.now();
    let estimatedTokens = 0;
    
    try {
      // We will attempt to force JSON output
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Please generate the service JSON now." }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000,
      });

      const responseText = response.choices[0]?.message?.content || "{}";
      const latency = Date.now() - startTime;
      
      const usage = response.usage;
      const reportedTokens = usage?.total_tokens || 0;
      estimatedTokens = Math.ceil((systemPrompt.length + responseText.length) / 4);

      // Log Usage
      await providerManager.logUsage({
        phone: systemId,
        provider: providerName,
        model: model,
        providerReportedTokens: reportedTokens,
        estimatedTokens: estimatedTokens,
        latency,
        success: true
      });

      // Parse and Validate with Zod
      const parsedJson = JSON.parse(responseText);
      const validatedData = GeneratedServiceSchema.parse(parsedJson);

      return validatedData;

    } catch (error: any) {
      // Log Failure
      await providerManager.logUsage({
        phone: systemId,
        provider: providerName,
        model: model,
        providerReportedTokens: 0,
        estimatedTokens: estimatedTokens || 500, // guess if failed early
        latency: Date.now() - startTime,
        success: false
      });

      console.error("AI Generation Failed:", error);
      throw new Error("Failed to generate or parse AI content. Please try regenerating.");
    }
  }
};
