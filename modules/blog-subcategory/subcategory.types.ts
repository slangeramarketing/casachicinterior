/***************************************************
 * File: modules/blogs/subcategory.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Represents raw MongoDB subcategory records
 *
 * Responsibilities:
 * - Define plain DB object shape returned by repository
 *
 * Restrictions:
 * - Must NOT contain DTOs
 * - Must NOT contain formatting logic
 ***************************************************/

import { Types } from "mongoose";

export interface SubCategoryRecord {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  categoryId: Types.ObjectId; // Parent Category ID
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
