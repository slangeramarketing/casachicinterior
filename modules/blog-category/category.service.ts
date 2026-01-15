/***************************************************
 * File: modules/blogs/category.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Contains all business logic for Blog Categories
 *
 * Responsibilities:
 * - Validate inputs
 * - Enforce domain rules (uniqueness, existence)
 * - Decide which repository operations to call
 *
 * Restrictions:
 * - Must NOT format response
 * - Must NOT return DTOs
 * - Must NOT access HTTP, cookies, or auth directly
 ***************************************************/

import { categoryRepository } from "./category.repository";
import { CategoryRecord } from "./category.types";
import { CreateCategoryDTO, UpdateCategoryDTO } from "./category.dto";

export const categoryService = {
  /**
   * Purpose:
   * - Create a new category
   *
   * Used By:
   * - Server Facade / Controller
   *
   * Returns:
   * - Created Category DB record
   */
  async create(data: CreateCategoryDTO): Promise<CategoryRecord> {
    // basic validation
    if (!data.name || !data.slug) {
      throw new Error("Name and slug are required");
    }

    // enforce unique slug
    const existing = await categoryRepository.filter({ slug: data.slug });
    if (existing.length > 0) {
      throw new Error("Category with this slug already exists");
    }

    return categoryRepository.create({
      name: data.name,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive ?? true,
    });
  },

  /**
   * Purpose:
   * - Update existing category
   */
  async update(
    id: string,
    data: UpdateCategoryDTO
  ): Promise<CategoryRecord> {
    const existing = await categoryService.getById(id);

    // slug uniqueness check (only if changed)
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await categoryRepository.filter({ slug: data.slug });
      if (slugExists.length > 0) {
        throw new Error("Category with this slug already exists");
      }
    }

    const updated = await categoryRepository.updateById(id, data);

    if (!updated) {
      // safety guard (should not normally happen)
      throw new Error("Failed to update category");
    }

    return updated;
  },

  /**
   * Purpose:
   * - Delete category
   */
  async delete(id: string): Promise<CategoryRecord> {
    const deleted = await categoryRepository.deleteById(id);

    if (!deleted) {
      throw new Error("Category not found");
    }

    return deleted;
  },

  /**
   * Purpose:
   * - Get category by ID
   */
  async getById(id: string): Promise<CategoryRecord> {
    const category = await categoryRepository.getById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  },

  /**
   * Purpose:
   * - Get all categories
   */
  async getAll(): Promise<CategoryRecord[]> {
    return categoryRepository.getAll();
  },

  /**
   * Purpose:
   * - Get filtered categories
   */
  async filter(filter: {
    isActive?: boolean;
    slug?: string;
    name?: string;
  }): Promise<CategoryRecord[]> {
    return categoryRepository.filter(filter);
  },
};
