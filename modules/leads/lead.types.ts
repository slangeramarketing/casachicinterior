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
  status: "new" | "qualified" | "site_visit_scheduled" | "converted";
  createdAt: Date;
  updatedAt: Date;
}
