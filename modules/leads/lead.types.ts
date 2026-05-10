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
  status: "new" | "qualified" | "site_visit_scheduled" | "converted";
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
