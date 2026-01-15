/***************************************************
 * File: modules/blogs/category.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Next.js–specific adapter for Category module
 *
 * Responsibilities:
 * - Perform auth & role checks for WRITE operations
 * - Call service layer
 * - Map DB records to Response DTOs
 *
 * Restrictions:
 * - Must NOT access repository directly
 * - Must NOT contain business logic
 * - Must NOT return plain DB records
 ***************************************************/

import { categoryService } from "./category.service";
import { categoryMapper } from "./category.mapper";
import { CreateCategoryDTO, UpdateCategoryDTO } from "./category.dto";
import { getAuthUser } from "@/lib/auth";

export const categoryServer = {
  /**
   * Create category (ADMIN only)
   */
  async create(data: CreateCategoryDTO) {
    const authUser = await getAuthUser();

    if (!authUser || (authUser.role !== "admin" && authUser.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await categoryService.create(data);
    return categoryMapper.toResponse(record);
  },

  /**
   * Update category (ADMIN only)
   */
  async update(id: string, data: UpdateCategoryDTO) {
    const authUser = await getAuthUser();

    if (!authUser || (authUser.role !== "admin" && authUser.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await categoryService.update(id, data);
    return categoryMapper.toResponse(record);
  },

  /**
   * Delete category (ADMIN only)
   */
  async delete(id: string) {
    const authUser = await getAuthUser();

    if (!authUser || (authUser.role !== "admin" && authUser.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await categoryService.delete(id);
    return categoryMapper.toResponse(record);
  },

  /**
   * Get category by ID (Admin / Server Components)
   */
  async getById(id: string) {
    const record = await categoryService.getById(id);
    return categoryMapper.toResponse(record);
  },

  /**
   * Get all categories (Admin / Server Components)
   */
  async getAll() {
    const records = await categoryService.getAll();
    return categoryMapper.toResponseList(records);
  },

  /**
   * Filter categories (Admin / Server Components)
   */
  async filter(filter: {
    isActive?: boolean;
    slug?: string;
    name?: string;
  }) {
    const records = await categoryService.filter(filter);
    return categoryMapper.toResponseList(records);
  },
};
