/***************************************************
 * File: modules/blogs/subcategory.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Converts SubCategory DB records into response DTOs
 *
 * Responsibilities:
 * - _id → id
 * - category(ObjectId) → categoryId(string)
 * - Date → ISO string
 *
 * Restrictions:
 * - Must NOT access database
 * - Must NOT contain business logic
 ***************************************************/

import { SubCategoryRecord } from "./subcategory.types";
import { SubCategoryResponseDTO } from "./subcategory.dto";

export const subCategoryMapper = {
  /**
   * Purpose:
   * - Convert SubCategory DB record to response DTO
   */
  toResponse(record: SubCategoryRecord): SubCategoryResponseDTO {
    return {
      id: record._id.toString(),
      name: record.name,
      slug: record.slug,
      description: record.description,
      categoryId: record.category.toString(),
      isActive: record.isActive,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  },

  /**
   * Purpose:
   * - Convert multiple SubCategory records
   */
  toResponseList(
    records: SubCategoryRecord[]
  ): SubCategoryResponseDTO[] {
    return records.map(this.toResponse);
  },
};
