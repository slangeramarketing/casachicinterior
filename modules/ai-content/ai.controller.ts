import { aiContentService } from "./ai.service";
import { GenerateServicePromptInput, GenerateServiceResponse } from "./ai.types";

export const aiContentController = {
  async generateService(input: GenerateServicePromptInput): Promise<GenerateServiceResponse> {
    try {
      if (!input.userPrompt || input.userPrompt.trim().length === 0) {
        return { success: false, error: "Prompt cannot be empty" };
      }

      const generatedData = await aiContentService.generateService(input);
      
      return {
        success: true,
        data: generatedData
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "An unexpected error occurred during generation"
      };
    }
  }
};
