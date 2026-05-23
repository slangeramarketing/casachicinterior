import mongoose, { Schema, Document } from "mongoose";

export interface IAiUsage {
  phone: string;
  leadId?: mongoose.Types.ObjectId;
  provider: string;
  model: string;
  providerReportedTokens: number;
  estimatedTokens: number;
  estimatedCost: number;
  latency: number; // in milliseconds
  success: boolean;
  createdAt: Date;
}

const AiUsageSchema = new Schema<IAiUsage>({
  phone: { type: String, required: true },
  leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
  provider: { type: String, required: true },
  model: { type: String, required: true },
  providerReportedTokens: { type: Number, default: 0 },
  estimatedTokens: { type: Number, default: 0 },
  estimatedCost: { type: Number, default: 0 },
  latency: { type: Number, default: 0 },
  success: { type: Boolean, default: true }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes for fast querying on Dashboard
AiUsageSchema.index({ phone: 1 });
AiUsageSchema.index({ createdAt: -1 });

// Avoid OverwriteModelError in Next.js HMR
export const AiUsage = mongoose.models.AiUsage || mongoose.model<IAiUsage>("AiUsage", AiUsageSchema);
