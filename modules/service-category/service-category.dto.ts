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
/***************************************************
 * File: modules/service-categories/service-category.dto.ts
 * Layer: DTO
 ***************************************************/

/* -------------------------------------
   Shared Sub-Interfaces
------------------------------------- */
export interface CategorySeoDTO {
  title?: string;
  description?: string;
}

/* -------------------------------------
   Create DTO
------------------------------------- */
export interface CreateServiceCategoryDTO {
  name: string;
  slug: string;
  
  description?: string;
  icon?: string;         // Icon ID from our icon constants
  thumbnail?: string;    // URL from UploadThing/Cloudinary
  
  parentId?: string | null;

  displayOrder?: number;
  status?: "active" | "inactive";
  
  seo?: CategorySeoDTO;
}

/* -------------------------------------
   Update DTO
------------------------------------- */
export interface UpdateServiceCategoryDTO {
  name?: string;
  slug?: string;
  
  description?: string;
  icon?: string;
  thumbnail?: string;
  
  parentId?: string | null;

  displayOrder?: number;
  status?: "active" | "inactive";
  
  seo?: CategorySeoDTO;
}

/* -------------------------------------
   Response DTO
------------------------------------- */
export interface ServiceCategoryResponseDTO {
  id: string;

  name: string;
  slug: string;
  
  description?: string;
  icon?: string;
  thumbnail?: string;

  parentId: string | null;

  // Optional: Hierarchy support in frontend
  // Use this if you want to return nested sub-categories
  children?: ServiceCategoryResponseDTO[]; 

  displayOrder: number;
  status: "active" | "inactive";

  seo?: CategorySeoDTO;

  createdAt: string;
  updatedAt: string;
}