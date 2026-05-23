/***************************************************
 * File: modules/leads/lead.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Plain TypeScript interfaces for the Lead domain
 *
 * Responsibilities:
 * - Define the DB structure (ILeadDB)
 ***************************************************/
import { Types } from "mongoose";

export interface ILeadDB {
  _id: Types.ObjectId;
  phone: string;
  name?: string;
  location?: string;
  requirement?: string;
  messages: string[];
  intent?: string;
  portfolioSent?: boolean;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "SITE_VISIT" | "QUOTE_SENT" | "NEGOTIATION" | "CONVERTED" | "LOST";
  leadScore: number;
  owner?: string;
  notes?: string;
  automationMode: "AUTO" | "MANUAL"; // legacy, kept for compatibility
  label?: "UNKNOWN" | "LEAD" | "CLIENT" | "RELATIVE" | "VIP" | "TEAM";
  conversationOwner?: "AUTO" | "MANUAL";
  convertedAt?: Date;
  automationStoppedAt?: Date;
  lastActivityAt: Date;
  updatedBy?: string;
  timeline: { event: string; details?: string; timestamp: Date }[];
  conversationState: {
    askedStyle?: boolean;
    askedBudget?: boolean;
    askedKitchenSize?: boolean;
    askedSiteVisit?: boolean;
    sharedPortfolio?: boolean;
    sharedWebsite?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
