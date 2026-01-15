/***************************************************
 * File: modules/services/service.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Defines input and output contracts for Service module
 *
 * Responsibilities:
 * - Provide clean client-facing shapes
 *
 * Restrictions:
 * - Must NOT use ObjectId or Date
 ***************************************************/

/* -------------------------------------
   Create Service DTO
------------------------------------- */
export interface CreateServiceDTO {
  slug: string;
  title: string;

  shortDescription: string;
  description: string;
  categoryId: string;

  coverImage: string;
  gallery?: string[];

  highlights: string[];

  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];

  featured?: boolean;
  status?: "draft" | "published";
  displayOrder?: number;

  ctaText?: string;
  ctaLink?: string;
}

/* -------------------------------------
   Update Service DTO
------------------------------------- */
export interface UpdateServiceDTO {
  title?: string;

  shortDescription?: string;
  description?: string;
  categoryId?: string;

  coverImage?: string;
  gallery?: string[];

  highlights?: string[];

  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];

  featured?: boolean;
  status?: "draft" | "published";
  displayOrder?: number;

  ctaText?: string;
  ctaLink?: string;
}

/* -------------------------------------
   Service Response DTO
------------------------------------- */
export interface ServiceResponseDTO {
  id: string;

  slug: string;
  title: string;

  shortDescription: string;
  description: string;
  categoryId: string;

  coverImage: string;
  gallery: string[];

  highlights: string[];

  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];

  featured: boolean;
  status: "draft" | "published";
  displayOrder: number;

  ctaText?: string;
  ctaLink?: string;

  createdAt: string;
  updatedAt: string;
}
