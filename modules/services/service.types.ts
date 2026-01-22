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

// Raw Database Record (As stored in MongoDB)
export interface ServiceRecord {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  shortDescription: string;
  description: any; 
  categoryId: Types.ObjectId; // Plain ObjectId
  coverImage: string;
  gallery: {
    url: string;
    alt?: string;
    caption?: string;
  }[];
  videoShowcase: {
    reels: {
      url: string;
      thumbnail?: string;
      title?: string;
    }[];
    youtube: {
      embedId: string;
      title?: string;
      description?: string;
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

// Populated Category ka interface (Sirf selective fields jo repository fetch karegi)
export interface PopulatedCategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  icon?: string;
}

// Final Populated Record Type
export interface ServiceWithPopulatedCategory extends Omit<ServiceRecord, "categoryId"> {
  categoryId: PopulatedCategory; // categoryId ab ek string nahi, object hai
}