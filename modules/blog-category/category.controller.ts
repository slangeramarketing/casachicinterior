/***************************************************
 * File: modules/blogs/category.controller.ts
 * Layer: Controller
 *
 * Purpose:
 * - Handles HTTP APIs for Category module
 *
 * Responsibilities:
 * - Handle request/response lifecycle
 * - Call service layer
 * - Apply mapper before sending response
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT access repository directly
 ***************************************************/

import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "./category.service";
import { categoryMapper } from "./category.mapper";

export const categoryController = {
  /**
   * Public API: Get all active categories
   */
  async getAll(req: NextRequest) {
    try {
      const records = await categoryService.filter({ isActive: true });
      return NextResponse.json({
        success: true,
        data: categoryMapper.toResponseList(records),
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  },

  /**
   * Public API: Get category by slug
   */
  async getBySlug(
    req: NextRequest,
    { params }: { params: { slug: string } }
  ) {
    try {
      const records = await categoryService.filter({
        slug: params.slug,
        isActive: true,
      });

      if (records.length === 0) {
        return NextResponse.json(
          { success: false, message: "Category not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: categoryMapper.toResponse(records[0]),
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  },
};
