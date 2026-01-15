/***************************************************
 * File: modules/blogs/subcategory.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Next.js server-side adapter for SubCategory
 *
 * Responsibilities:
 * - Perform auth & role checks for WRITE operations
 * - Call service functions
 * - Map DB records to Response DTOs
 *
 * Restrictions:
 * - Must NOT access repository directly
 * - Must NOT contain business logic
 * - Must NOT return plain DB records
 ***************************************************/

import { getAuthUser } from "@/lib/auth";
import {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryById,
  getAllSubCategories,
  getSubCategoriesByCategory,
  filterSubCategories,
} from "./subcategory.service";
import { subCategoryMapper } from "./subcategory.mapper";
import {
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from "./subcategory.dto";

export const subCategoryServer = {
  /**
   * Create subcategory (ADMIN only)
   */
  async create(data: CreateSubCategoryDTO) {
    const authUser = await getAuthUser();
    if (!authUser || (authUser.role !== "admin" && authUser.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await createSubCategory(data);
    return subCategoryMapper.toResponse(record);
  },

  /**
   * Update subcategory (ADMIN only)
   */
  async update(id: string, data: UpdateSubCategoryDTO) {
    const authUser = await getAuthUser();
    if (!authUser || (authUser.role !== "admin" && authUser.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await updateSubCategory(id, data);
    return subCategoryMapper.toResponse(record);
  },

  /**
   * Delete subcategory (ADMIN only)
   */
  async delete(id: string) {
    const authUser = await getAuthUser();
    if (!authUser || (authUser.role !== "admin" && authUser.role !== "super_admin")) {
      throw new Error("Unauthorized");
    }

    const record = await deleteSubCategory(id);
    return subCategoryMapper.toResponse(record);
  },

  /**
   * Get subcategory by ID
   */
  async getById(id: string) {
    const record = await getSubCategoryById(id);
    return subCategoryMapper.toResponse(record);
  },

  /**
   * Get all subcategories
   */
  async getAll() {
    const records = await getAllSubCategories();
    return subCategoryMapper.toResponseList(records);
  },

  /**
   * Get subcategories by category
   */
  async getByCategory(categoryId: string) {
    const records = await getSubCategoriesByCategory(categoryId);
    return subCategoryMapper.toResponseList(records);
  },

  /**
   * Filter subcategories
   */
  async filter(filter: {
    category?: string;
    slug?: string;
    isActive?: boolean;
  }) {
    const records = await filterSubCategories(filter);
    return subCategoryMapper.toResponseList(records);
  },
};
