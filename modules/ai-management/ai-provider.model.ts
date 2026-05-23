import mongoose, { Schema, Document } from "mongoose";

export interface IAiProvider {
  provider: string; // "Nvidia", "OpenAI", "Anthropic", etc.
  model: string; // e.g. "meta/llama-4-maverick-17b-128e-instruct"
  encryptedKey: string;
  isActive: boolean;
  expiresAt?: Date;
  dailyLimit?: number; // Tokens or Requests
  monthlyLimit?: number; // Tokens or Requests
  rpm?: number; // Requests per minute
  createdAt: Date;
  updatedAt: Date;
}

const AiProviderSchema = new Schema<IAiProvider>({
  provider: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  encryptedKey: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  expiresAt: { type: Date },
  dailyLimit: { type: Number },
  monthlyLimit: { type: Number },
  rpm: { type: Number, default: 60 }
}, {
  timestamps: true
});

// Avoid OverwriteModelError in Next.js HMR
export const AiProvider = mongoose.models.AiProvider || mongoose.model<IAiProvider>("AiProvider", AiProviderSchema);
