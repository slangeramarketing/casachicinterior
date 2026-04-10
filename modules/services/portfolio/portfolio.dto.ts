/***************************************************
 * File: modules/services/portfolio/portfolio.dto.ts
 * Layer: DTO (Data Transfer Object)
 *
 * Purpose:
 * - Defines the clean, UI-safe data shapes passed to Client Components.
 *
 * Responsibilities:
 * - Formatted fields (INR strings, human-readable timelines)
 * - Safe for serialization (no ObjectId, no Dates)
 *
 * Restrictions:
 * - Must NOT contain Mongoose references
 * - Must NOT contain raw DB fields
 ***************************************************/

export interface MaterialSpecDTO {
  brand: string;
  category: string;
  productLine?: string;
}

export interface PortfolioItemDTO {
  id: string;
  title: string;
  renovationType: string;
  location: string;

  beforeImg: string;
  afterImg: string;

  // Formatted for display
  costRange: string;         // e.g. "₹1,200 – ₹1,800 per sq. ft."
  timelineLabel: string;     // e.g. "45 Days"

  materialSpecList: MaterialSpecDTO[];
  highlights: string[];

  featured: boolean;
}
