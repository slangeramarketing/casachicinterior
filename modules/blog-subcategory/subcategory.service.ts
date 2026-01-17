/***************************************************
 * File: modules/blogs/subcategory.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Contains all business logic for SubCategory
 *
 * Responsibilities:
 * - Validate inputs
 * - Ensure parent Category exists
 * - Enforce slug + category uniqueness
 * - Coordinate repository operations
 *
 * Restrictions:
 * - Must NOT format response
 * - Must NOT return DTOs
 * - Must NOT access HTTP, cookies, or auth
 ***************************************************/

import { subCategoryRepository } from "./subcategory.repository";
import { SubCategoryRecord } from "./subcategory.types";
import {
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from "./subcategory.dto";
import { categoryRepository } from "../blog-category/category.repository";
import db from "@/lib/db";

/**
 * Create subcategory
 */
export async function createSubCategory(
  data: CreateSubCategoryDTO
): Promise<SubCategoryRecord> {
  await db();   // before mongoose queries;
  if (!data.name || !data.slug || !data.categoryId) {
    throw new Error("Name, slug and categoryId are required");
  }

  // ensure parent category exists
  const category = await categoryRepository.getById(data.categoryId);
  if (!category) {
    throw new Error("Parent category not found");
  }

  // enforce unique slug under same category
  const existing = await subCategoryRepository.filter({
    slug: data.slug,
    category: data.categoryId,
  });

  if (existing.length > 0) {
    throw new Error(
      "Subcategory with this slug already exists in this category"
    );
  }

  return subCategoryRepository.create({
    name: data.name,
    slug: data.slug,
    description: data.description,
    categoryId: data.categoryId as any,
    isActive: data.isActive ?? true,
  });
}

/**
 * Update subcategory
 */
export async function updateSubCategory(
  id: string,
  data: UpdateSubCategoryDTO
): Promise<SubCategoryRecord> {
  await db();   // before mongoose queries;
  const existing = await getSubCategoryById(id);

  // validate category change
  if (data.categoryId && data.categoryId !== existing.categoryId.toString()) {
    const category = await categoryRepository.getById(data.categoryId);
    if (!category) {
      throw new Error("Parent category not found");
    }
  }

  // enforce unique slug under same category
  if (data.slug || data.categoryId) {
    const categoryId = data.categoryId ?? existing.categoryId.toString();
    const slug = data.slug ?? existing.slug;

    const conflict = await subCategoryRepository.filter({
      slug,
      category: categoryId,
    });

    if (
      conflict.length > 0 &&
      conflict[0]._id.toString() !== id
    ) {
      throw new Error(
        "Subcategory with this slug already exists in this category"
      );
    }
  }

  const updated = await subCategoryRepository.updateById(id, {
    name: data.name,
    slug: data.slug,
    description: data.description,
    categoryId: data.categoryId as any,
    isActive: data.isActive,
  });

  if (!updated) {
    throw new Error("Failed to update subcategory");
  }

  return updated;
}

/**
 * Delete subcategory
 */
export async function deleteSubCategory(
  id: string
): Promise<SubCategoryRecord> {
  await db();   // before mongoose queries;
  const deleted = await subCategoryRepository.deleteById(id);
  if (!deleted) {
    throw new Error("Subcategory not found");
  }
  return deleted;
}

/**
 * Get subcategory by ID
 */
export async function getSubCategoryById(
  id: string
): Promise<SubCategoryRecord> {
  await db();   // before mongoose queries;
  const subcategory = await subCategoryRepository.getById(id);
  if (!subcategory) {
    throw new Error("Subcategory not found");
  }
  return subcategory;
}

/**
 * Get all subcategories
 */
export async function getAllSubCategories(): Promise<
  SubCategoryRecord[]
> {
  await db();   // before mongoose queries;
  return subCategoryRepository.getAll();
}

/**
 * Get subcategories by category
 */
export async function getSubCategoriesByCategory(
  categoryId: string
): Promise<SubCategoryRecord[]> {
  await db();   // before mongoose queries;
  return subCategoryRepository.getByCategory(categoryId);
}

/**
 * Filter subcategories
 */
export async function filterSubCategories(filter: {
  category?: string;
  slug?: string;
  isActive?: boolean;
}): Promise<SubCategoryRecord[]> {
  await db();   // before mongoose queries;
  return subCategoryRepository.filter(filter);
}
