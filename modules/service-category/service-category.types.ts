/***************************************************
 * File: modules/service-categories/service-category.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Defines raw DB record shape for ServiceCategory
 *
 * Responsibilities:
 * - Represent plain MongoDB documents returned by repository
 *
 * Restrictions:
 * - Must NOT contain DTOs
 * - Must NOT contain formatting logic
 ***************************************************/
/***************************************************
 * File: modules/service-categories/service-category.types.ts
 * Layer: Types
 ***************************************************/

import { Types } from "mongoose";

export interface ServiceCategoryRecord {
  _id: Types.ObjectId;

  /* --- Identity --- */
  name: string;
  slug: string;

  /* --- UI & Content --- */
  description?: string;
  icon?: string;         // Icon Picker ID
  thumbnail?: string;    // Image URL

  /* --- Hierarchy --- */
  parentId: Types.ObjectId | null;

  /* --- SEO --- */
  seo?: {
    title?: string;
    description?: string;
  };

  /* --- Admin Controls --- */
  displayOrder: number;
  status: "active" | "inactive";

  createdAt: Date;
  updatedAt: Date;
}