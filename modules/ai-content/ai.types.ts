import { GeneratedServiceData } from "./ai.schema";

export interface GenerateServicePromptInput {
  userPrompt: string;
  categories: { id: string; name: string; description: string }[];
}

export interface GenerateServiceResponse {
  success: boolean;
  data?: GeneratedServiceData;
  error?: string;
}
