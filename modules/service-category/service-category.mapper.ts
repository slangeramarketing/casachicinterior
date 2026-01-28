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
import { ServiceCategoryRecord } from "./service-category.types";
import { ServiceCategoryResponseDTO } from "./service-category.dto";

export const serviceCategoryMapper = {
  toResponse(record: ServiceCategoryRecord): ServiceCategoryResponseDTO {
    if (!record || !record._id) {
      throw new Error("Invalid ServiceCategory record: missing _id");
    }

    return {
      id: record._id.toString(),

      name: record.name ?? "",
      slug: record.slug ?? "",

      description: record.description ?? "",
      icon: record.icon ?? "",
      thumbnail: record.thumbnail ?? "",

      parentId:
        record.parentId && typeof record.parentId === "object"
          ? record.parentId.toString()
          : typeof record.parentId === "string"
          ? record.parentId
          : null,

      displayOrder: record.displayOrder ?? 0,
      status: record.status ?? "inactive",

      seo: {
        title:
          record.seo?.title?.trim() ||
          record.name ||
          "",
        description:
          record.seo?.description?.trim() ||
          record.description ||
          "",
      },

      createdAt:
        record.createdAt instanceof Date
          ? record.createdAt.toISOString()
          : typeof record.createdAt === "string"
          ? record.createdAt
          : "",

      updatedAt:
        record.updatedAt instanceof Date
          ? record.updatedAt.toISOString()
          : typeof record.updatedAt === "string"
          ? record.updatedAt
          : "",
    };
  },

  toResponseList(
    records: ServiceCategoryRecord[]
  ): ServiceCategoryResponseDTO[] {
    if (!Array.isArray(records)) return [];
    return records.map((record) => this.toResponse(record));
  },
};
