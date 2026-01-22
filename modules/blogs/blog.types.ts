/***************************************************
 * File: modules/blogs/blog.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Represents raw MongoDB Blog records (Lean Objects).
 *
 * Responsibilities:
 * - Define plain DB object shape returned by repository.
 * - Provide populated variants for service layer consumption.
 *
 * Restrictions:
 * - Must NOT contain DTOs.
 * - Must NOT contain formatting or mapping logic.
 ***************************************************/
import { Types } from "mongoose";

export interface IBlogRecord {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  thumbnail?: string;
  bannerImage?: string;
  categoryId: Types.ObjectId;
  authorId: Types.ObjectId;
  tags: string[];
  readingTime?: number;
  viewCount: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
    ogImage?: string;
    canonicalUrl?: string;
    metaRobots: string;
  };
  status: "draft" | "published";
  featured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a Blog Record with Category and Author details populated.
 */
export interface IPopulatedBlogRecord extends Omit<IBlogRecord, "categoryId" | "authorId"> {
  categoryId: {
    _id: Types.ObjectId;
    name: string;
    slug: string;
  };
  authorId: {
    _id: Types.ObjectId;
    name: string;
    image?: string;
  };
}