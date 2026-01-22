/***************************************************
 * File: modules/blog-category/blog-category.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Business logic for Blog Categories.
 *
 * Responsibilities:
 * - Fetching flat and tree-ready records.
 * - Validation rules for categories.
 *
 * Restrictions:
 * - Must NOT use Mappers (Mapping belongs to Facade).
 * - Returns IBlogCategoryRecord (DB Model Type).
 ***************************************************/

import { blogCategoryRepository } from "./blog-category.repository";
import { CreateBlogCategoryDTO, UpdateBlogCategoryDTO } from "./blog-category.dto";
import { IBlogCategoryRecord } from "./blog-category.types";

/**
 * Fetch all categories for Tree structure
 * Note: Service returns raw records, Facade will call Mapper.toTree
 */
export async function getCategoryTree(): Promise<IBlogCategoryRecord[]> {
  return await blogCategoryRepository.findAll();
}

/**
 * Fetch all categories as a flat list
 */
export async function getAllCategories(): Promise<IBlogCategoryRecord[]> {
  return await blogCategoryRepository.findAll();
} 

/**
 * Slug ke basis par category dhoondhna
 */
export async function getCategoryBySlug(slug: string): Promise<IBlogCategoryRecord | null> {
  return await blogCategoryRepository.findBySlug(slug);
}

/**
 * ID ke basis par category dhoondhna (Populated)
 */
export async function getCategoryById(id: string): Promise<IBlogCategoryRecord | null> {
  return await blogCategoryRepository.findById(id);
}

/**
 * Create a new blog category
 */
export async function createBlogCategory(data: CreateBlogCategoryDTO): Promise<IBlogCategoryRecord> {
  const existing = await blogCategoryRepository.findBySlug(data.slug);
  if (existing) throw new Error("Category with this slug already exists");

  return await blogCategoryRepository.create(data);
}

/**
 * Update an existing category
 */
export async function updateBlogCategory(id: string, data: UpdateBlogCategoryDTO): Promise<IBlogCategoryRecord> {
  if (data.slug) {
    const existing = await blogCategoryRepository.findBySlug(data.slug);
    if (existing && existing._id.toString() !== id) {
      throw new Error("Slug is already taken");
    }
  }

  const updated = await blogCategoryRepository.update(id, data);
  if (!updated) throw new Error("Category not found");

  return updated;
}

/**
 * Delete category by ID
 */
export async function deleteBlogCategory(id: string): Promise<boolean> {
  const result = await blogCategoryRepository.delete(id);
  return !!result;
}