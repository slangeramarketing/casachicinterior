/***************************************************
 * File: modules/services/portfolio/portfolio.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Defines raw portfolio record shape from the local JSON data store.
 *
 * Restrictions:
 * - Must NOT contain DTOs
 * - Must NOT contain formatting logic
 * - Must NOT be exposed to UI
 ***************************************************/

export type RenovationType =
  | "modular-kitchen"
  | "living-room"
  | "bedroom"
  | "bathroom"
  | "full-home";

export interface MaterialSpec {
  brand: string;
  category: string; // e.g., "Plywood", "Hardware", "Paint"
  productLine?: string; // e.g., "Century 710"
}

// Raw record as stored in JSON
export interface PortfolioRecord {
  id: string;
  title: string;
  renovationType: RenovationType;
  location: string; // e.g. "Noida, UP"

  beforeImg: string;
  afterImg: string;

  costEstimate: {
    min: number; // in INR
    max: number;
    unit: string; // e.g. "per sq. ft." or "total"
  };

  timeline: {
    duration: number; // numeric
    unit: "days" | "weeks" | "months";
  };

  materialSpecList: MaterialSpec[];

  highlights: string[]; // short bullet points

  featured: boolean;
  order: number;
}
