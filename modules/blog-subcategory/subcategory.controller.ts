/***************************************************
 * File: modules/blogs/subcategory.controller.ts
 * Layer: Controller
 *
 * Purpose:
 * - HTTP API layer for SubCategory
 *
 * Responsibilities:
 * - Handle request/response lifecycle
 * - Call service functions
 * - Apply mapper before sending response
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT access repository directly
 ***************************************************/

import { NextRequest, NextResponse } from "next/server";
import {
  filterSubCategories,
  getSubCategoriesByCategory,
} from "./subcategory.service";
import { subCategoryMapper } from "./subcategory.mapper";

export const subCategoryController = {
  /**
   * Public API: Get active subcategories by category
   */
  async getByCategory(
    req: NextRequest,
    { params }: { params: { categoryId: string } }
  ) {
    try {
      const records = await getSubCategoriesByCategory(params.categoryId);
      const active = records.filter((r) => r.isActive);

      return NextResponse.json({
        success: true,
        data: subCategoryMapper.toResponseList(active),
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  },

  /**
   * Public API: Get subcategory by slug + category
   */
  async getBySlug(
    req: NextRequest,
    { params }: { params: { slug: string; categoryId: string } }
  ) {
    try {
      const records = await filterSubCategories({
        slug: params.slug,
        category: params.categoryId,
        isActive: true,
      });

      if (records.length === 0) {
        return NextResponse.json(
          { success: false, message: "Subcategory not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: subCategoryMapper.toResponse(records[0]),
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  },
};
