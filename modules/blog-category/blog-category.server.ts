/***************************************************
 * File: modules/blog-category/blog-category.server.ts
 * Layer: Server Facade (Server Actions Boundary)
 ***************************************************/

import {
  getAllCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getCategoryBySlug,
  getCategoryById,
} from "./blog-category.service";
import {
  BlogCategoryResponseDTO,
  CreateBlogCategoryDTO,
  UpdateBlogCategoryDTO,
} from "./blog-category.dto";
import { blogCategoryMapper } from "./blog-category.mapper";
import { AppError } from "@/lib/errors/AppError";

export function handleError(
  error: unknown
): { success: false; error: string; code: string; statusCode: number } {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  return {
    success: false,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    statusCode: 500,
  };
}

export const blogCategoryServer = {
  /**
   * 1. Tree Structure (Admin / UI)
   */
  async getTree() {
    try {
      const records = await getAllCategories();
      const dtoList = blogCategoryMapper.toResponseList(records);
      const tree = blogCategoryMapper.toTree(dtoList);

      return { success: true, data: tree };
    } catch (error) {
      return handleError(error);
    }
  },

/**
 * 2. Flat List (Dropdowns / Tables)
 */
async getList(): Promise<
  | { success: true; data: BlogCategoryResponseDTO[] }
  | { success: false; error: string; code: string; statusCode: number }
> {
  try {
    const records = await getAllCategories();
    const data = blogCategoryMapper.toResponseList(records);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return handleError(error);
  }
},

  /**
   * Get by Slug
   */
  async getBySlug(slug: string) {
    try {
      const record = await getCategoryBySlug(slug);
      if (!record) {
        return {
          success: false,
          error: "Category not found",
          code: "BLOG_CATEGORY_NOT_FOUND",
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: blogCategoryMapper.toResponse(record),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get by ID
   */
  async getById(id: string) {
    try {
      const record = await getCategoryById(id);
      if (!record) {
        return {
          success: false,
          error: "Category not found",
          code: "BLOG_CATEGORY_NOT_FOUND",
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: blogCategoryMapper.toResponse(record),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Create Category
   */
  async create(data: CreateBlogCategoryDTO) {
    try {
      const record = await createBlogCategory(data);
      return {
        success: true,
        data: blogCategoryMapper.toResponse(record),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Update Category
   */
  async update(id: string, data: UpdateBlogCategoryDTO) {
    try {
      const record = await updateBlogCategory(id, data);
      return {
        success: true,
        data: blogCategoryMapper.toResponse(record),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Delete Category
   */
  async delete(id: string) {
    try {
      const result = await deleteBlogCategory(id);
      return { success: true, data: result };
    } catch (error) {
      return handleError(error);
    }
  },
};
