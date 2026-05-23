import mongoose, { Schema } from "mongoose";

const contactRuleSchema = new Schema({
  phone: { type: String, required: true, unique: true },
  mode: { 
    type: String, 
    enum: ["AUTO", "MANUAL"], 
    default: "AUTO" 
  },
  label: { 
    type: String, 
    enum: ["UNKNOWN", "LEAD", "CLIENT", "RELATIVE", "VIP"], 
    default: "UNKNOWN" 
  },
  notes: { type: String, required: false },
  enabled: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const ContactRuleModel = mongoose.models.ContactRule || mongoose.model("ContactRule", contactRuleSchema);
