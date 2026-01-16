/***************************************************
 * File: modules/blogs/category.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Converts DB records into response DTOs
 *
 * Responsibilities:
 * - _id → id
 * - Date → ISO string
 *
 * Restrictions:
 * - Must NOT access database
 * - Must NOT contain business logic
 ***************************************************/

import { ResponseCategoryDTO } from "./category.dto";
import { CategoryRecord } from "./category.types";

export const categoryMapper = {
  /**
   * Purpose:
   * - Convert Category DB record to response DTO
   *
   * Used By:
   * - Controller
   * - Server Facade
   *
   * Returns:
   * - Client-safe CategoryResponseDTO
   */
  toResponse(record: CategoryRecord): ResponseCategoryDTO {
    return {
      id: record._id.toString(),
      name: record.name,
      slug: record.slug,
      description: record.description,
      isActive: record.isActive,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  },

  /**
   * Purpose:
   * - Convert multiple records at once
   */
  toResponseList(records: CategoryRecord[]): ResponseCategoryDTO[] {
    return records.map(this.toResponse);
  },
};
