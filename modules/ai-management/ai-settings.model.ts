import mongoose, { Schema, Document } from "mongoose";

export interface IAiSettings extends Document {
  singletonKey: string;
  isAiPaused: boolean;
  updatedAt: Date;
}

const AiSettingsSchema = new Schema<IAiSettings>({
  singletonKey: { type: String, default: "GLOBAL", unique: true },
  isAiPaused: { type: Boolean, default: false }
}, {
  timestamps: { createdAt: false, updatedAt: true }
});

export const AiSettings = mongoose.models.AiSettings || mongoose.model<IAiSettings>("AiSettings", AiSettingsSchema);
