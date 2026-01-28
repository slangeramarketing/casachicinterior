/***************************************************
 * File: modules/blogs/blog.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Business logic and orchestration for the Blog module.
 *
 * Responsibilities:
 * - Validate slug uniqueness.
 * - Calculate reading time based on content.
 * - Manage publishedAt timestamps based on status changes.
 *
 * Restrictions:
 * - Must NOT call Mappers (Mapping happens in Server Facade).
 * - Must NOT return DTOs (Returns IBlogRecord or IPopulatedBlogRecord).
 ***************************************************/
/***************************************************
 * File: modules/blogs/blog.service.ts
 * Layer: Service
 ***************************************************/

import { Types } from "mongoose";
import { blogRepository } from "./blog.repository";
import { IBlogRecord, IPopulatedBlogRecord } from "./blog.types";
import { CreateBlogDTO, UpdateBlogDTO } from "./blog.dto";
import { AppError } from "@/lib/errors/AppError";

/* =====================================================
   INTERNAL HELPERS
===================================================== */

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/* =====================================================
   READ
===================================================== */

export async function getAllBlogs(
  query: Record<string, any> = {}
): Promise<IPopulatedBlogRecord[]> {
  return blogRepository.findAll(query);
}

export async function getBlogBySlug(
  slug: string
): Promise<IPopulatedBlogRecord> {
  const record = await blogRepository.findBySlug(slug);

  if (!record) {
    throw new AppError({
      message: "Blog not found",
      code: "BLOG_NOT_FOUND",
      statusCode: 404,
      context: { slug },
    });
  }

  // fire-and-forget
  blogRepository.incrementViews(record._id.toString()).catch(() => {});

  return record;
}

export async function getBlogById(
  id: string
): Promise<IPopulatedBlogRecord> {
  const record = await blogRepository.findById(id);

  if (!record) {
    throw new AppError({
      message: "Blog not found",
      code: "BLOG_NOT_FOUND",
      statusCode: 404,
      context: { id },
    });
  }

  return record;
}

/* =====================================================
   WRITE
===================================================== */

export async function createBlog(
  data: CreateBlogDTO
): Promise<IBlogRecord> {
  const existing = await blogRepository.findBySlug(data.slug);
  if (existing) {
    throw new AppError({
      message: "Blog slug already exists",
      code: "BLOG_SLUG_CONFLICT",
      statusCode: 409,
      context: { slug: data.slug },
    });
  }

  const readingTime = calculateReadingTime(data.content);

  const payload: Partial<IBlogRecord> = {
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    content: data.content,
    thumbnail: data.thumbnail,
    bannerImage: data.bannerImage,

    // 🔥 FIX: string → ObjectId
    categoryId: new Types.ObjectId(data.categoryId),
    authorId: new Types.ObjectId(data.authorId),

    tags: data.tags ?? [],
    status: data.status,
    featured: data.featured ?? false,
    readingTime,
    seo: data.seo as any,

    publishedAt:
      data.status === "published" ? new Date() : undefined,
  };

  return blogRepository.create(payload);
}

export async function updateBlog(
  id: string,
  data: UpdateBlogDTO
): Promise<IBlogRecord> {
  if (data.slug) {
    const existing = await blogRepository.findBySlug(data.slug);
    if (existing && existing._id.toString() !== id) {
      throw new AppError({
        message: "Slug already used by another blog",
        code: "BLOG_SLUG_CONFLICT",
        statusCode: 409,
        context: { id, slug: data.slug },
      });
    }
  }

  const payload: Partial<IBlogRecord> = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.slug !== undefined) payload.slug = data.slug;
  if (data.summary !== undefined) payload.summary = data.summary;
  if (data.content !== undefined) {
    payload.content = data.content;
    payload.readingTime = calculateReadingTime(data.content);
  }

  if (data.thumbnail !== undefined) payload.thumbnail = data.thumbnail;
  if (data.bannerImage !== undefined) payload.bannerImage = data.bannerImage;

  if (data.categoryId) {
    payload.categoryId = new Types.ObjectId(data.categoryId);
  }

  if (data.authorId) {
    payload.authorId = new Types.ObjectId(data.authorId);
  }

  if (data.tags) payload.tags = data.tags;
  if (data.seo) payload.seo = data.seo as any;
  if (data.featured !== undefined) payload.featured = data.featured;
  if (data.status) {
    payload.status = data.status;
    if (data.status === "published") {
      payload.publishedAt = new Date();
    }
  }

  const updated = await blogRepository.updateById(id, payload);

  if (!updated) {
    throw new AppError({
      message: "Blog not found",
      code: "BLOG_NOT_FOUND",
      statusCode: 404,
      context: { id },
    });
  }

  return updated;
}




export async function deleteBlog(id: string): Promise<boolean> {
  const deleted = await blogRepository.deleteById(id);

  if (!deleted) {
    throw new AppError({
      message: "Blog not found",
      code: "BLOG_NOT_FOUND",
      statusCode: 404,
      context: { id },
    });
  }

  return true;
}
