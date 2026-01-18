import { BlogRecord, BlogPopulatedRecord } from "./blog.types";
import { BlogResponseDTO } from "./blog.dto";
import { Types } from "mongoose";

export const blogMapper = {
  /**
   * Helper: Check if a field is populated
   */
  isPopulated(obj: any): obj is { _id: Types.ObjectId; name: string; slug: string } {
    return obj && typeof obj === "object" && "name" in obj;
  },

  /**
   * Convert Blog DB record to response DTO
   */
  toResponse(record: BlogRecord | BlogPopulatedRecord): BlogResponseDTO {
    // Determine category data
    const isCatPopulated = this.isPopulated(record.categoryId);
    const isSubPopulated = record.subCategoryId ? this.isPopulated(record.subCategoryId) : false;

    return {
      id: record._id.toString(),
      title: record.title,
      slug: record.slug,
      description: record.description,
      richText: record.richText,
      thumbnailImage: record.thumbnailImage,

      // IDs (Always strings in DTO)
      categoryId: isCatPopulated 
        ? (record.categoryId as any)._id.toString() 
        : record.categoryId.toString(),
      
      subCategoryId: record.subCategoryId 
        ? (isSubPopulated ? (record.subCategoryId as any)._id.toString() : record.subCategoryId.toString())
        : undefined,

      // Populated Fields (Agar data populated hai toh object bhejenge, warna undefined)
      category: isCatPopulated ? {
        id: (record.categoryId as any)._id.toString(),
        name: (record.categoryId as any).name,
        slug: (record.categoryId as any).slug,
      } : undefined,

      subCategory: (record.subCategoryId && isSubPopulated) ? {
        id: (record.subCategoryId as any)._id.toString(),
        name: (record.subCategoryId as any).name,
        slug: (record.subCategoryId as any).slug,
      } : undefined,

      status: record.status,
      featured: record.featured,
      authorId: record.author.toString(),

      seo: record.seo,

      publishedAt: record.publishedAt
        ? record.publishedAt.toISOString()
        : undefined,

      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  },

  /**
   * Convert multiple Blog records
   */
  toResponseList(records: (BlogRecord | BlogPopulatedRecord)[]): BlogResponseDTO[] {
    return records.map((record) => this.toResponse(record));
  },
};