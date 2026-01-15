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

/* -------------------------------------
   Service DB Record
------------------------------------- */
export interface ServiceRecord {
  _id: Types.ObjectId;

  slug: string;
  title: string;

  shortDescription: string;
  description: string;
  categoryId: Types.ObjectId;

  coverImage: string;
  gallery: string[];

  highlights: string[];

  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];

  featured: boolean;
  status: "draft" | "published";
  displayOrder: number;

  ctaText?: string;
  ctaLink?: string;

  createdAt: Date;
  updatedAt: Date;
}
