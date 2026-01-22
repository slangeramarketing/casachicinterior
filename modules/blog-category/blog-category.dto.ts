/***************************************************
 * File: modules/blog-category/blog-category.dto.ts
 * Layer: DTO
 * Purpose: Client-facing contracts (Input/Output).
 ***************************************************/

export interface BlogCategorySeoDTO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  metaRobots: string;
  canonicalUrl: string;
}

export interface CreateBlogCategoryDTO {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  icon?: string;
  coverImage?: string;
  seo?: Partial<BlogCategorySeoDTO>;
  status: "active" | "inactive";
  displayOrder?: number;
}

export interface UpdateBlogCategoryDTO extends Partial<CreateBlogCategoryDTO> {}

export interface BlogCategoryResponseDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  icon: string;
  coverImage: string;
  seo: BlogCategorySeoDTO;
  status: "active" | "inactive";
  displayOrder: number;
  isSubCategory: boolean;
  children?: BlogCategoryResponseDTO[];
  createdAt: string;
  updatedAt: string;
}