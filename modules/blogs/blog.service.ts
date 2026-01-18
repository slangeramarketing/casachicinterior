/***************************************************
 * File: modules/blogs/blog.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Business logic for Blog
 *
 * Responsibilities:
 * - Validate category & subcategory relationship
 * - Handle publishedAt rule
 *
 * Restrictions:
 * - Must NOT format response
 * - Must NOT return DTOs
 ***************************************************/

import { blogRepository } from "./blog.repository";
import { BlogPopulatedRecord, BlogRecord } from "./blog.types";
import { CreateBlogDTO, UpdateBlogDTO } from "./blog.dto";
import { subCategoryRepository } from "../blog-subcategory/subcategory.repository";
import { categoryRepository } from "../blog-category/category.repository";
import db from "@/lib/db";

/**
 * Create blog
 */
export async function createBlog(
  authorId: string,
  data: CreateBlogDTO
): Promise<BlogRecord> {
  await db();   // before mongoose queries;
  if (!data.title || !data.slug || !data.categoryId) {
    throw new Error("Title, slug and categoryId are required");
  }

  // validate category
  const category = await categoryRepository.getById(data.categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  // validate subcategory (if provided)
  if (data.subCategoryId) {
    const subCategory = await subCategoryRepository.getById(
      data.subCategoryId
    );

    if (!subCategory) {
      throw new Error("SubCategory not found");
    }

    if (subCategory.categoryId.toString() !== data.categoryId) {
      throw new Error(
        "SubCategory does not belong to selected Category"
      );
    }
  }

  const status = data.status ?? "draft";

  return blogRepository.create({
    title: data.title,
    slug: data.slug,
    description: data.description,
    richText: data.richText,
    thumbnailImage: data.thumbnailImage,

    categoryId: data.categoryId as any,
    subCategoryId: data.subCategoryId as any,

    status,
    featured: data.featured ?? false,

    author: authorId as any,

    seo: data.seo,
    publishedAt: status === "published" ? new Date() : undefined,
  });
}

/**
 * Update blog
 */
export async function updateBlog(
  id: string,
  data: UpdateBlogDTO
): Promise<BlogRecord> {
  await db();   // before mongoose queries;
  const existing = await getBlogById(id);

  // validate category change
  if (data.categoryId) {
    const category = await categoryRepository.getById(data.categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
  }

  // validate subcategory change
  if (data.subCategoryId) {
    const categoryId =
      data.categoryId ?? existing.categoryId.toString();

    const subCategory = await subCategoryRepository.getById(
      data.subCategoryId
    );

    if (!subCategory) {
      throw new Error("SubCategory not found");
    }

    if (subCategory.categoryId.toString() !== categoryId) {
      throw new Error(
        "SubCategory does not belong to selected Category"
      );
    }
  }

  // handle publish logic
  let publishedAt = existing.publishedAt;

  if (data.status && data.status !== existing.status) {
    publishedAt =
      data.status === "published" ? new Date() : undefined;
  }

  const updated = await blogRepository.updateById(id, {
    title: data.title,
    slug: data.slug,
    description: data.description,
    richText: data.richText,
    thumbnailImage: data.thumbnailImage,

    categoryId: data.categoryId as any,
    subCategoryId: data.subCategoryId as any,

    status: data.status,
    featured: data.featured,

    seo: data.seo,
    publishedAt,
  });

  if (!updated) {
    throw new Error("Failed to update blog");
  }

  return updated;
}

/**
 * Delete blog
 */
export async function deleteBlog(id: string): Promise<BlogRecord> {
  await db();   // before mongoose queries;
  const deleted = await blogRepository.deleteById(id);
  if (!deleted) {
    throw new Error("Blog not found");
  }
  return deleted;
}

/**
 * Get blog by ID
 */
export async function getBlogById(id: string): Promise<BlogRecord> {
  await db();   // before mongoose queries;
  const blog = await blogRepository.getById(id);
  if (!blog) {
    throw new Error("Blog not found");
  }
  return blog;
}

/**
 * Get blog by Slug
 */
export async function getBlogBySlug(slug: string): Promise<BlogPopulatedRecord> {
  await db(); 
  const blog = await blogRepository.getBySlugPopulated(slug);
  
  if (!blog) {
    throw new Error("Blog not found with this slug");
  }
  
  return blog;
}

/**
 * Get all blogs
 */
export async function getAllBlogs(): Promise<BlogPopulatedRecord[]> {
  await db();   // before mongoose queries;
  return blogRepository.getAllPopulated();
}

/**
 * Filter blogs
 */
export async function filterBlogs(filter: {
  status?: "draft" | "published";
  featured?: boolean;
  categoryId?: string;
  subCategoryId?: string;
  slug?: string;
}): Promise<BlogPopulatedRecord[]> {
  await db();   // before mongoose queries;
  return blogRepository.filterPopulated(filter);
}
