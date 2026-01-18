/***************************************************
 * File: modules/blogs/blog.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Represents raw MongoDB Blog records
 *
 * Responsibilities:
 * - Define plain DB object shape returned by repository
 *
 * Restrictions:
 * - Must NOT contain DTOs
 * - Must NOT contain formatting logic
 ***************************************************/

import { Types } from "mongoose";

export type BlogStatus = "draft" | "published";

export interface BlogRecord {
  _id: Types.ObjectId;

  title: string;
  slug: string;
  description?: string;
  richText?: string;
  thumbnailImage?: string;

  /**
   * Category reference
   */
  categoryId: Types.ObjectId;

  /**
   * SubCategory reference (optional)
   */
  subCategoryId?: Types.ObjectId;

  status: BlogStatus;
  featured: boolean;

  /**
   * Author reference
   */
  author: Types.ObjectId;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };

  publishedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}


// Category aur SubCategory ke basic shapes define karein
export interface PopulatedCategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
}

export interface PopulatedSubCategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
}

// Ye record tab use hoga jab hum populate() chalayenge
export interface BlogPopulatedRecord extends Omit<BlogRecord, 'categoryId' | 'subCategoryId'> {
  categoryId: PopulatedCategory;
  subCategoryId?: PopulatedSubCategory;
}
