/***************************************************
 * File: modules/blogs/category.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Defines external contracts for Category
 *
 * Responsibilities:
 * - Client-facing data structures
 *
 * Restrictions:
 * - Must NOT use ObjectId
 * - Must NOT use Date objects
 ***************************************************/

/* =========================
   CREATE DTO
========================= */
export interface CreateCategoryDTO {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

/* =========================
   UPDATE DTO
========================= */
export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

/* =========================
   RESPONSE DTO
========================= */
export interface ResponseCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
