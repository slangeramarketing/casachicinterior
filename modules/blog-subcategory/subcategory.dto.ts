/***************************************************
 * File: modules/blogs/subcategory.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Defines external contracts for SubCategory
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
export interface CreateSubCategoryDTO {
  name: string;
  slug: string;
  description?: string;
  categoryId: string; // Parent Category ID
  isActive?: boolean;
}

/* =========================
   UPDATE DTO
========================= */
export interface UpdateSubCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  isActive?: boolean;
}

/* =========================
   RESPONSE DTO
========================= */
export interface SubCategoryResponseDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
