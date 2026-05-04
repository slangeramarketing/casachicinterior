/***************************************************
 * File: modules/leads/lead.model.ts
 * Layer: Model
 *
 * Purpose:
 * - Defines the MongoDB Mongoose schema for Leads
 *
 * Responsibilities:
 * - Define strict data types and constraints
 * - Automatically manage createdAt and updatedAt timestamps
 * - NO business logic here
 ***************************************************/
import mongoose, { Schema } from "mongoose";

const leadSchema = new Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: false },
  location: { type: String, required: false },
  requirement: { type: String, required: false },
  messages: { type: [String], default: [] },
  intent: { type: String, required: false },
  status: { 
    type: String, 
    enum: ["new", "qualified", "site_visit_scheduled", "converted"], 
    default: "new" 
  }
}, {
  timestamps: true
});

// Avoid OverwriteModelError in Next.js HMR
export const LeadModel = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
