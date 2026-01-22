/***************************************************
 * File: modules/blog-category/blog-category.mapper.ts
 * Layer: Mapper
 * Purpose: Converts Plain DB Types → Response DTO.
 ***************************************************/
import { IBlogCategoryRecord } from "./blog-category.types";
import { BlogCategoryResponseDTO } from "./blog-category.dto";

export const blogCategoryMapper = {
  /**
   * Purpose: Map a single DB record to a Response DTO
   */
  toResponse(record: IBlogCategoryRecord): BlogCategoryResponseDTO {
    return {
      id: record._id.toString(),
      name: record.name,
      slug: record.slug,
      description: record.description || "",
      parentId: record.parentId ? record.parentId.toString() : null,
      icon: record.icon || "",
      coverImage: record.coverImage || "",
      seo: {
        metaTitle: record.seo?.metaTitle || "",
        metaDescription: record.seo?.metaDescription || "",
        keywords: record.seo?.keywords || [],
        metaRobots: record.seo?.metaRobots || "index, follow",
        canonicalUrl: record.seo?.canonicalUrl || "",
      },
      status: record.status,
      displayOrder: record.displayOrder,
      isSubCategory: record.parentId !== null,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  },

  /**
   * Purpose: Convert an array of records
   */
  toResponseList(records: IBlogCategoryRecord[]): BlogCategoryResponseDTO[] {
    return records.map((record) => this.toResponse(record));
  },

  /**
   * Purpose: Converts a flat array of DTOs into a nested Tree structure
   */
  toTree(dtoList: BlogCategoryResponseDTO[]): any[] {
    const map: { [key: string]: any } = {};
    const tree: any[] = [];

    // 1. Pehle saare items ka ek map banao for quick access
    dtoList.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    // 2. Parent-child relationship set karo
    dtoList.forEach((item) => {
      if (item.parentId && map[item.parentId]) {
        // Agar parent mil gaya, toh uske children array mein push kardo
        map[item.parentId].children.push(map[item.id]);
      } else {
        // Agar parentId null hai, toh ye root category hai
        tree.push(map[item.id]);
      }
    });

    return tree;
  }
};