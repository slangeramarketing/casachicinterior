/***************************************************
 * File: modules/blog-category/blog-category.service.ts
 * Layer: Service
 ***************************************************/

import db from "@/lib/db";
import { Types } from "mongoose";
import { blogCategoryRepository } from "./blog-category.repository";
import {
  CreateBlogCategoryDTO,
  UpdateBlogCategoryDTO,
} from "./blog-category.dto";
import { IBlogCategoryRecord } from "./blog-category.types";
import { AppError } from "@/lib/errors/AppError";

/* =====================================================
   READ
===================================================== */

export async function getAllCategories(): Promise<IBlogCategoryRecord[]> {
  await db();
  return blogCategoryRepository.findAll();
}

export async function getCategoryTree(): Promise<IBlogCategoryRecord[]> {
  await db();
  return blogCategoryRepository.findAll();
}

export async function getCategoryBySlug(
  slug: string
): Promise<IBlogCategoryRecord | null> {
  await db();
  return blogCategoryRepository.findBySlug(slug);
}

export async function getCategoryById(
  id: string
): Promise<IBlogCategoryRecord | null> {
  await db();
  return blogCategoryRepository.findById(id);
}

/* =====================================================
   WRITE
===================================================== */

export async function createBlogCategory(
  data: CreateBlogCategoryDTO
): Promise<IBlogCategoryRecord> {
  await db();

  const existing = await blogCategoryRepository.findBySlug(data.slug);
  if (existing) {
    throw new AppError({
      message: "Category with this slug already exists",
      code: "BLOG_CATEGORY_SLUG_CONFLICT",
      statusCode: 409,
      context: { slug: data.slug },
    });
  }

  // ✅ DTO → DB RECORD MAPPING (IMPORTANT)
  return blogCategoryRepository.create({
    name: data.name,
    slug: data.slug,
    description: data.description ?? "",
    parentId: data.parentId ? new Types.ObjectId(data.parentId) : null,
    icon: data.icon,
    coverImage: data.coverImage,

    seo: {
      metaTitle: data.seo?.metaTitle,
      metaDescription: data.seo?.metaDescription,
      keywords: data.seo?.keywords ?? [],
      metaRobots: data.seo?.metaRobots ?? "index, follow",
      canonicalUrl: data.seo?.canonicalUrl,
    },

    status: data.status,
    displayOrder: data.displayOrder ?? 0,
  });
}

export async function updateBlogCategory(
  id: string,
  data: UpdateBlogCategoryDTO
): Promise<IBlogCategoryRecord> {
  await db();

  if (data.slug) {
    const existing = await blogCategoryRepository.findBySlug(data.slug);
    if (existing && existing._id.toString() !== id) {
      throw new AppError({
        message: "Slug already used by another category",
        code: "BLOG_CATEGORY_SLUG_CONFLICT",
        statusCode: 409,
        context: { id, slug: data.slug },
      });
    }
  }

  const updated = await blogCategoryRepository.updateById(id, {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.slug !== undefined && { slug: data.slug }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.icon !== undefined && { icon: data.icon }),
    ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.displayOrder !== undefined && {
      displayOrder: data.displayOrder,
    }),
    ...(data.parentId !== undefined && {
      parentId: data.parentId
        ? new Types.ObjectId(data.parentId)
        : null,
    }),
    ...(data.seo && {
      seo: {
        metaTitle: data.seo.metaTitle,
        metaDescription: data.seo.metaDescription,
        keywords: data.seo.keywords ?? [],
        metaRobots: data.seo.metaRobots ?? "index, follow",
        canonicalUrl: data.seo.canonicalUrl,
      },
    }),
  });

  if (!updated) {
    throw new AppError({
      message: "Category not found",
      code: "BLOG_CATEGORY_NOT_FOUND",
      statusCode: 404,
      context: { id },
    });
  }

  return updated;
}

export async function deleteBlogCategory(id: string): Promise<boolean> {
  await db();

  const hasChildren = await blogCategoryRepository.hasChildren(id);
  if (hasChildren) {
    throw new AppError({
      message: "Cannot delete category with sub-categories",
      code: "BLOG_CATEGORY_HAS_CHILDREN",
      statusCode: 400,
      context: { id },
    });
  }

  const deleted = await blogCategoryRepository.deleteById(id);
  if (!deleted) {
    throw new AppError({
      message: "Category not found",
      code: "BLOG_CATEGORY_NOT_FOUND",
      statusCode: 404,
      context: { id },
    });
  }

  return true;
}
