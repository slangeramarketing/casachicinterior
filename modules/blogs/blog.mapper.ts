/***************************************************
 * File: modules/blogs/blog.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Converts Blog DB records into response DTOs
 *
 * Responsibilities:
 * - _id → id
 * - author(ObjectId) → authorId(string)
 * - Date → ISO string
 *
 * Restrictions:
 * - Must NOT access database
 * - Must NOT contain business logic
 ***************************************************/

import { BlogRecord } from "./blog.types";
import { BlogResponseDTO } from "./blog.dto";

export const blogMapper = {
  /**
   * Convert Blog DB record to response DTO
   */
  toResponse(record: BlogRecord): BlogResponseDTO {
    return {
      id: record._id.toString(),

      title: record.title,
      slug: record.slug,
      description: record.description,
      richText: record.richText,
      thumbnailImage: record.thumbnailImage,

      categoryId: record.categoryId.toString(),
      subCategoryId: record.subCategoryId?.toString(),

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
  toResponseList(records: BlogRecord[]): BlogResponseDTO[] {
    return records.map(this.toResponse);
  },
};
