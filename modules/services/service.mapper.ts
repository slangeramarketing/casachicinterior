/***************************************************
 * File: modules/services/service.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Converts Service DB records into Response DTOs
 *
 * Responsibilities:
 * - ObjectId → string
 * - Date → ISO string
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT access database
 ***************************************************/

import { ServiceRecord } from "./service.types";
import { ServiceResponseDTO } from "./service.dto";

/* -------------------------------------
   Mapper Object
------------------------------------- */
export const serviceMapper = {
  /**
   * Purpose:
   * - Convert a Service DB record to response DTO
   *
   * Used By:
   * - Controller
   * - Server Facade
   */
  toResponse(record: ServiceRecord): ServiceResponseDTO {
    return {
      id: record._id.toString(),

      slug: record.slug,
      title: record.title,

      shortDescription: record.shortDescription,
      description: record.description,
      categoryId: record.categoryId.toString(),

      coverImage: record.coverImage,
      gallery: record.gallery,

      highlights: record.highlights,

      seoTitle: record.seoTitle,
      seoDescription: record.seoDescription,
      seoKeywords: record.seoKeywords,

      featured: record.featured,
      status: record.status,
      displayOrder: record.displayOrder,

      ctaText: record.ctaText,
      ctaLink: record.ctaLink,

      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  },

  /**
   * Purpose:
   * - Convert multiple records at once
   */
  toResponseList(records: ServiceRecord[]): ServiceResponseDTO[] {
    return records.map(this.toResponse);
  },
};
