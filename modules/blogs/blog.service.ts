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
import { blogRepository } from "./blog.repository";
import { IBlogRecord, IPopulatedBlogRecord } from "./blog.types";
import { CreateBlogDTO, UpdateBlogDTO } from "./blog.dto";

/**
 * Helper: Logic to calculate reading time
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Fetch all blogs from repository
 */
export async function getAllBlogs(query: any = {}): Promise<IPopulatedBlogRecord[]> {
  return await blogRepository.findAll(query);
}

/**
 * Fetch a single blog and increment views
 */
export async function getBlogBySlug(slug: string): Promise<IPopulatedBlogRecord> {
  const record = await blogRepository.findBySlug(slug);
  if (!record) throw new Error("Blog not found");
  
  // Background task: increment views
  await blogRepository.incrementViews(record._id.toString());
  
  return record;
}

/**
 * Purpose: Fetch a single blog by its MongoDB ID
 * Used by: Admin Edit/View pages
 */
export async function getBlogById(id: string): Promise<IPopulatedBlogRecord> {
  // 1. Repository se data fetch karein (Populated version)
  const record = await blogRepository.findById(id);
  
  // 2. Error handling agar record na mile
  if (!record) {
    throw new Error("Blog post not found with the provided ID");
  }
  
  // Note: Admin view mein hum usually views increment nahi karte, 
  // par agar aap chahte hain toh yahan bhi incrementViews call kar sakte hain.
  
  return record;
}

/**
 * Create a new blog with business rules
 */
export async function createBlog(data: CreateBlogDTO): Promise<IBlogRecord> {
  // 1. Business Rule: Slug must be unique
  const existing = await blogRepository.findBySlug(data.slug);
  if (existing) throw new Error("Blog slug already exists");

  // 2. Business Rule: Calculate reading time
  const readingTime = calculateReadingTime(data.content);

  // 3. Business Rule: Set publishedAt if status is published
  const finalData: any = {
    ...data,
    readingTime,
    publishedAt: data.status === "published" ? new Date() : undefined
  };

  return await blogRepository.create(finalData);
}

/**
 * Update blog with business rules
 */
export async function updateBlog(id: string, data: UpdateBlogDTO): Promise<IBlogRecord> {
  // 1. Slug uniqueness check if slug is being updated
  if (data.slug) {
    const existing = await blogRepository.findBySlug(data.slug);
    if (existing && existing._id.toString() !== id) {
      throw new Error("Slug is already taken by another blog");
    }
  }

  const updatePayload: any = { ...data };

  // 2. Recalculate reading time if content changes
  if (data.content) {
    updatePayload.readingTime = calculateReadingTime(data.content);
  }

  // 3. Update publishedAt if status changes to published
  if (data.status === "published") {
    updatePayload.publishedAt = new Date();
  }

  const updated = await blogRepository.update(id, updatePayload);
  if (!updated) throw new Error("Blog not found for update");

  return updated;
}

/**
 * Delete blog
 */
export async function deleteBlog(id: string): Promise<boolean> {
  const result = await blogRepository.delete(id);
  return !!result;
}