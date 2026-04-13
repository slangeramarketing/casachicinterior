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
  materialType?: string;
}

export interface PortfolioItemDTO {
  id: string;
  slug: string;
  title: string;
  renovationType: string;
  location: string;

  beforeImg: string;
  afterImg: string;
  gallery: string[];
  videoUrl?: string;

  // Formatted for display
  costRange: string;
  costBreakdown?: { category: string; amountLabel: string }[];
  milestones?: { title: string; day: string }[];
  timelineLabel: string;

  materialSpecList: MaterialSpecDTO[];
  highlights: string[];

  testimonial?: {
    quote: string;
    clientName: string;
    clientPhoto: string;
  };
  designReference?: {
    renderImg: string;
    finalImg: string;
  };

  featured: boolean;
}
