/***************************************************
 * File: modules/blog-category/blog-category.types.ts
 * Layer: Types
 * Purpose: Represents raw MongoDB documents (Lean Objects).
 ***************************************************/
import { Types } from "mongoose";

export interface IBlogCategoryRecord {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parentId: Types.ObjectId | null;
  icon?: string;
  coverImage?: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
    metaRobots: string;
    canonicalUrl?: string;
  };
  status: "active" | "inactive";
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Purpose: For use when .populate('parentId') is called in repository
 */
export interface IPopulatedBlogCategoryRecord extends Omit<IBlogCategoryRecord, 'parentId'> {
  parentId: {
    _id: Types.ObjectId;
    name: string;
    slug: string;
  } | null;
}