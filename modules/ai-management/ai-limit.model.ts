import mongoose, { Schema, Document } from "mongoose";

export interface IAiLimitEvent extends Document {
  provider: string;
  phone?: string;
  reason: string;
  limitType: "DAILY" | "MONTHLY" | "RPM" | "EXPIRY" | "PROVIDER_DOWN";
  usage?: number;
  limit?: number;
  createdAt: Date;
}

const AiLimitEventSchema = new Schema<IAiLimitEvent>({
  provider: { type: String, required: true },
  phone: { type: String },
  reason: { type: String, required: true },
  limitType: { type: String, enum: ["DAILY", "MONTHLY", "RPM", "EXPIRY", "PROVIDER_DOWN"], required: true },
  usage: { type: Number },
  limit: { type: Number }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export const AiLimitEvent = mongoose.models.AiLimitEvent || mongoose.model<IAiLimitEvent>("AiLimitEvent", AiLimitEventSchema);
