/***************************************************
 * File: modules/blogs/blog.controller.ts
 * Layer: Controller
 *
 * Purpose:
 * - Public HTTP APIs for Blog module
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
import { filterBlogs } from "./blog.service";
import { blogMapper } from "./blog.mapper";

export const blogController = {
  /**
   * Public API: Get all published blogs
   */
  async getPublished(req: NextRequest) {
    try {
      const records = await filterBlogs({ status: "published" });

      return NextResponse.json({
        success: true,
        data: blogMapper.toResponseList(records),
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  },

  /**
   * Public API: Get published blog by slug
   */
  async getBySlug(
    req: NextRequest,
    { params }: { params: { slug: string } }
  ) {
    try {
      const records = await filterBlogs({
        slug: params.slug,
        status: "published",
      });

      if (records.length === 0) {
        return NextResponse.json(
          { success: false, message: "Blog not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: blogMapper.toResponse(records[0]),
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  },

  /**
   * Public API: Get published blogs by category
   */
  async getByCategory(
    req: NextRequest,
    { params }: { params: { categoryId: string } }
  ) {
    try {
      const records = await filterBlogs({
        categoryId: params.categoryId,
        status: "published",
      });

      return NextResponse.json({
        success: true,
        data: blogMapper.toResponseList(records),
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  },
};
