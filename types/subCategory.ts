// src/types/subCategory.ts

/* -------------------------------------
   Read DTO (used after populate / fetch)
------------------------------------- */
export interface SubCategoryDTO {
  _id: string;

  name: string;
  slug: string;

  description?: string;

  /**
   * When populated → object
   * When not populated → string (categoryId)
   */
  category:
    | {
        _id: string;
        name: string;
        slug: string;
      }
    | string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------
   Create Input (form / action → service)
------------------------------------- */
export interface CreateSubCategoryInputDTO {
  name: string;
  slug: string;
  description?: string;

  /** Only categoryId comes while creating */
  categoryId: string;

  isActive: boolean;
}

/* -------------------------------------
   Update Input
------------------------------------- */
export interface UpdateSubCategoryInputDTO {
  name: string;
  slug: string;
  description?: string;

  categoryId: string;
  isActive: boolean;
}

/* -------------------------------------
   Mapper (DB → DTO)
   ⚠️ Server-side only
------------------------------------- */
export function mapSubCategoryToDTO(doc: any): SubCategoryDTO {
  return {
    _id: doc._id.toString(),

    name: doc.name,
    slug: doc.slug,
    description: doc.description,

    category:
      typeof doc.category === "string"
        ? doc.category
        : doc.category?._id
        ? {
            _id: doc.category._id.toString(),
            name: doc.category.name,
            slug: doc.category.slug,
          }
        : doc.category?.toString(),

    isActive: doc.isActive,

    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
