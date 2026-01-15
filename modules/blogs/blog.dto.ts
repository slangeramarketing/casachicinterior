/***************************************************
 * File: modules/blogs/blog.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Defines external contracts for Blog
 *
 * Responsibilities:
 * - Client-facing input/output structures
 *
 * Restrictions:
 * - Must NOT use ObjectId
 * - Must NOT use Date objects
 ***************************************************/

export type BlogStatus = "draft" | "published";

/* =========================
   CREATE DTO
========================= */
export interface CreateBlogDTO {
  title: string;
  slug: string;
  description?: string;
  richText?: string;
  thumbnailImage?: string;

  categoryId: string;
  subCategoryId?: string;

  status?: BlogStatus;
  featured?: boolean;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

/* =========================
   UPDATE DTO
========================= */
export interface UpdateBlogDTO {
  title?: string;
  slug?: string;
  description?: string;
  richText?: string;
  thumbnailImage?: string;

  categoryId?: string;
  subCategoryId?: string;

  status?: BlogStatus;
  featured?: boolean;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

/* =========================
   RESPONSE DTO
========================= */
export interface BlogResponseDTO {
  id: string;

  title: string;
  slug: string;
  description?: string;
  richText?: string;
  thumbnailImage?: string;

  categoryId: string;
  subCategoryId?: string;

  status: BlogStatus;
  featured: boolean;

  authorId: string;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
