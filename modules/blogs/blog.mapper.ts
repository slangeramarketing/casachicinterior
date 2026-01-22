/***************************************************
 * File: modules/blogs/blog.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Converts raw/populated DB records into clean BlogResponseDTOs.
 * - Handles Date-to-String serialization and ID stringification.
 *
 * Responsibilities:
 * - Mapping raw DB fields to UI-friendly structures.
 * - Providing fallbacks for optional or missing fields.
 *
 * Restrictions:
 * - Must NOT contain business logic.
 * - Must NOT perform database operations.
 ***************************************************/
// modules/blogs/blog.mapper.ts

import { BlogResponseDTO } from "./blog.dto";

export const BlogMapper = {
  toResponse(doc: any): BlogResponseDTO {
    if (!doc) throw new Error("Mapper received null document");

    return {
      id: doc._id?.toString() || "",
      title: doc.title || "",
      slug: doc.slug || "",
      summary: doc.summary || "",
      content: doc.content || "",
      thumbnail: doc.thumbnail || "",
      bannerImage: doc.bannerImage || "",
      
      // Category: Agar populated hai to object use karega, nahi to sirf ID string
      category: {
        id: doc.categoryId?._id?.toString() || doc.categoryId?.toString() || "",
        name: doc.categoryId?.name || "Uncategorized",
        slug: doc.categoryId?.slug || "",
      },

      // Author: Same logic
      author: {
        id: doc.authorId?._id?.toString() || doc.authorId?.toString() || "",
        name: doc.authorId?.name || "Admin",
        image: doc.authorId?.image || "",
      },

      tags: Array.isArray(doc.tags) ? doc.tags : [],
      readingTime: doc.readingTime || 0,
      viewCount: doc.viewCount || 0,
      
      seo: {
        metaTitle: doc.seo?.metaTitle || doc.title || "",
        metaDescription: doc.seo?.metaDescription || doc.summary || "",
        keywords: doc.seo?.keywords || [],
        ogImage: doc.seo?.ogImage || doc.thumbnail || "",
        canonicalUrl: doc.seo?.canonicalUrl || "",
        metaRobots: doc.seo?.metaRobots || "index, follow",
      },

      status: doc.status || "draft",
      featured: Boolean(doc.featured),
      publishedAt: doc.publishedAt instanceof Date ? doc.publishedAt.toISOString() : undefined,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : new Date().toISOString(),
    };
  },

  toResponseList(docs: any[]): BlogResponseDTO[] {
    if (!Array.isArray(docs)) return [];
    return docs.map((doc) => this.toResponse(doc));
  }
};