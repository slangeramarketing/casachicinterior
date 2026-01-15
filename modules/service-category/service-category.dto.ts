/***************************************************
 * File: modules/service-categories/service-category.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Defines client-facing contracts for ServiceCategory
 *
 * Responsibilities:
 * - Input & output data shape for UI / APIs
 *
 * Restrictions:
 * - Must NOT use ObjectId or Date
 ***************************************************/

/* -------------------------------------
   Create DTO
------------------------------------- */
export interface CreateServiceCategoryDTO {
  name: string;
  slug: string;

  parentId?: string | null;

  displayOrder?: number;
  status?: "active" | "inactive";
}

/* -------------------------------------
   Update DTO
------------------------------------- */
export interface UpdateServiceCategoryDTO {
  name?: string;
  slug?: string;

  parentId?: string | null;

  displayOrder?: number;
  status?: "active" | "inactive";
}

/* -------------------------------------
   Response DTO
------------------------------------- */
export interface ServiceCategoryResponseDTO {
  id: string;

  name: string;
  slug: string;

  parentId: string | null;

  displayOrder: number;
  status: "active" | "inactive";

  createdAt: string;
  updatedAt: string;
}
