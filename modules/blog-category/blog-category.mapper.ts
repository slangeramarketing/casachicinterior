/***************************************************
 * File: modules/blog-category/blog-category.mapper.ts
 * Layer: Mapper
 * Purpose: Converts Plain DB Types → Response DTO.
 ***************************************************/

import { Types } from "mongoose";
import {
  IBlogCategoryRecord,
  IPopulatedBlogCategoryRecord,
} from "./blog-category.types";
import { BlogCategoryResponseDTO } from "./blog-category.dto";

type AnyCategoryRecord =
  | IBlogCategoryRecord
  | IPopulatedBlogCategoryRecord;

function normalizeParentId(
  parentId: AnyCategoryRecord["parentId"]
): string | null {
  if (!parentId) return null;

  // Case 1: ObjectId
  if (parentId instanceof Types.ObjectId) {
    return parentId.toString();
  }

  // Case 2: populated object
  if (typeof parentId === "object" && "_id" in parentId) {
    return parentId._id.toString();
  }

  return null;
}

export const blogCategoryMapper = {
  /**
   * Map single DB record → Response DTO
   */
  toResponse(record: AnyCategoryRecord): BlogCategoryResponseDTO {
    const parentId = normalizeParentId(record.parentId);

    return {
      id: record._id.toString(),
      name: record.name,
      slug: record.slug,
      description: record.description || "",

      parentId,

      icon: record.icon || "",
      coverImage: record.coverImage || "",

      seo: {
        metaTitle: record.seo?.metaTitle || record.name,
        metaDescription:
          record.seo?.metaDescription || record.description || "",
        keywords: record.seo?.keywords || [],
        metaRobots: record.seo?.metaRobots || "index, follow",
        canonicalUrl: record.seo?.canonicalUrl || "",
      },

      status: record.status,
      displayOrder: record.displayOrder,

      isSubCategory: !!parentId,

      createdAt:
        record.createdAt instanceof Date
          ? record.createdAt.toISOString()
          : record.createdAt,

      updatedAt:
        record.updatedAt instanceof Date
          ? record.updatedAt.toISOString()
          : record.updatedAt,
    };
  },

  /**
   * Map list
   */
  toResponseList(
    records: AnyCategoryRecord[]
  ): BlogCategoryResponseDTO[] {
    return records.map((record) => this.toResponse(record));
  },

  /**
   * Convert flat DTO list → Tree structure
   */
  toTree(
    dtoList: BlogCategoryResponseDTO[]
  ): BlogCategoryResponseDTO[] {
    const map: Record<string, BlogCategoryResponseDTO & { children: BlogCategoryResponseDTO[] }> = {};
    const tree: BlogCategoryResponseDTO[] = [];

    // Init map
    dtoList.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    // Build tree
    dtoList.forEach((item) => {
      if (item.parentId && map[item.parentId]) {
        map[item.parentId].children!.push(map[item.id]);
      } else {
        tree.push(map[item.id]);
      }
    });

    return tree;
  },
};
