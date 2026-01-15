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

import { Types } from "mongoose";

export interface ServiceCategoryRecord {
  _id: Types.ObjectId;

  name: string;
  slug: string;

  parentId: Types.ObjectId | null;

  displayOrder: number;
  status: "active" | "inactive";

  createdAt: Date;
  updatedAt: Date;
}
