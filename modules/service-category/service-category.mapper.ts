/***************************************************
 * File: modules/service-categories/service-category.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Converts ServiceCategory DB records to Response DTOs
 *
 * Responsibilities:
 * - ObjectId → string
 * - Date → ISO string
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT access database
 ***************************************************/
/***************************************************
 * File: modules/service-categories/service-category.mapper.ts
 * Layer: Mapper
 ***************************************************/

import { ServiceCategoryRecord } from "./service-category.types";
import { ServiceCategoryResponseDTO } from "./service-category.dto";

export const serviceCategoryMapper = {
  /**
   * Purpose:
   * - Convert single DB record to response DTO
   */
  toResponse(
    record: ServiceCategoryRecord
  ): ServiceCategoryResponseDTO {
    return {
      id: record._id.toString(),

      name: record.name,
      slug: record.slug,
      
      description: record.description || "",
      icon: record.icon || "",
      thumbnail: record.thumbnail || "",

      parentId: record.parentId
        ? record.parentId.toString()
        : null,

      displayOrder: record.displayOrder,
      status: record.status,

      // Nested SEO mapping with Fallbacks
      seo: {
        title: record.seo?.title || record.name,
        description: record.seo?.description || record.description || "",
      },

      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  },

  /**
   * Purpose:
   * - Convert list of DB records
   */
  toResponseList(
    records: ServiceCategoryRecord[]
  ): ServiceCategoryResponseDTO[] {
    // Context binding to avoid 'this' errors in .map()
    return records.map((record) => this.toResponse(record));
  },
};