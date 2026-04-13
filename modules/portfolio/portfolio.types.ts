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

export interface Milestone {
  title: string;
  day: string;
}

export interface CostBreakdownItem {
  category: string;
  amountLabel: string; // e.g., "₹4.5 Lacs"
}

export interface Testimonial {
  quote: string;
  clientName: string;
  clientPhoto: string;
}

// Raw record as stored in JSON
export interface PortfolioRecord {
  id: string;
  slug: string; // Dynamic URL identifier
  title: string;
  renovationType: RenovationType;
  location: string;

  beforeImg: string;
  afterImg: string;
  gallery: string[]; // Output Images
  videoUrl?: string; // YouTube/Vimeo link

  costEstimate: {
    min: number;
    max: number;
    unit: string;
  };

  costBreakdown?: CostBreakdownItem[];
  milestones?: Milestone[];

  timeline: {
    duration: number;
    unit: "days" | "weeks" | "months";
  };

  materialSpecList: MaterialSpec[];
  highlights: string[];

  testimonial?: Testimonial;
  designReference?: {
    renderImg: string;
    finalImg: string;
  };

  featured: boolean;
  order: number;
}
