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
  portfolioSent: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ["NEW", "CONTACTED", "QUALIFIED", "SITE_VISIT", "QUOTE_SENT", "NEGOTIATION", "CONVERTED", "LOST"], 
    default: "NEW" 
  },
  leadScore: { type: Number, default: 0 },
  owner: { type: String, required: false },
  notes: { type: String, required: false },
  lastActivityAt: { type: Date, default: Date.now },
  updatedBy: { type: String, required: false },
  automationMode: { type: String, enum: ["AUTO", "MANUAL"], default: "AUTO" },
  label: { type: String, enum: ["UNKNOWN", "LEAD", "CLIENT", "RELATIVE", "VIP", "TEAM"], default: "UNKNOWN" },
  conversationOwner: { type: String, enum: ["AUTO", "MANUAL"], default: "AUTO" },
  convertedAt: { type: Date, required: false },
  automationStoppedAt: { type: Date, required: false },
  timeline: [{
    event: String,
    details: String,
    timestamp: { type: Date, default: Date.now }
  }],
  conversationState: {
    askedStyle: { type: Boolean, default: false },
    askedBudget: { type: Boolean, default: false },
    askedKitchenSize: { type: Boolean, default: false },
    askedSiteVisit: { type: Boolean, default: false },
    sharedPortfolio: { type: Boolean, default: false },
    sharedWebsite: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Avoid OverwriteModelError in Next.js HMR
export const LeadModel = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
