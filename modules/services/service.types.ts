/***************************************************
 * File: modules/services/service.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Defines plain database record shape for Service
 *
 * Responsibilities:
 * - Represent raw MongoDB documents returned by repository
 *
 * Restrictions:
 * - Must NOT contain DTOs
 * - Must NOT contain formatting logic
 * - Must NOT be exposed to UI
 ***************************************************/

import { Types } from "mongoose";

// Raw Database Record
export interface ServiceRecord {
  _id: Types.ObjectId;

  slug: string;
  title: string;
  shortDescription: string;
  description: any;

  categoryId: Types.ObjectId;

  coverImage: string;

  gallery: {
    url: string;
    alt?: string;
    caption?: string;
  }[];

  videoShowcase: {
    enabled: boolean;        // 👈 feature toggle

    reels: {
      url: string;
      thumbnail?: string | null;
      title?: string;

      featured?: boolean;   // 👈 reel highlight
      order?: number;       // 👈 reel ordering
    }[];

    youtube: {
      embedId: string;
      title?: string;
      description?: string;

      featured?: boolean;   // 👈 video highlight
      order?: number;       // 👈 video ordering
    }[];
  };

  highlights: {
    icon: string;
    title: string;
  }[];

  faqs: {
    question: string;
    answer: string;
  }[];

  startingPrice?: number;
  priceUnit: string;

  seo: {
    title?: string;
    description?: string;
    keywords: string[];
    ogImage?: string;
    metaRobots: string;
  };

  featured: boolean;
  status: "draft" | "published" | "archived";
  displayOrder: number;

  ctaText: string;
  ctaLink: string;

  createdAt: Date;
  updatedAt: Date;
}

// Populated Category
export interface PopulatedCategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  icon?: string;
}

// Final populated record
export interface ServiceWithPopulatedCategory
  extends Omit<ServiceRecord, "categoryId"> {
  categoryId: PopulatedCategory;
}
