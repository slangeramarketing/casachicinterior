import db from "@/lib/db";
import mongoose from "mongoose";
import SubCategory from "./subcategory.model";
import {
  SubCategoryDTO,
  CreateSubCategoryInputDTO,
  mapSubCategoryToDTO,
} from "@/types/subCategory";

/* -------------------------------------
   CREATE
------------------------------------- */
export async function createSubCategory(
  data: CreateSubCategoryInputDTO
): Promise<SubCategoryDTO> {
  await db();

  const doc = await SubCategory.create({
    name: data.name,
    slug: data.slug,
    description: data.description,
    category: new mongoose.Types.ObjectId(data.categoryId),
    isActive: data.isActive,
  });

  return mapSubCategoryToDTO(doc);
}

/* -------------------------------------
   READ ALL
------------------------------------- */
export async function getAllSubCategories(): Promise<SubCategoryDTO[]> {
  await db();

  const docs = await SubCategory.find()
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  return docs.map(mapSubCategoryToDTO);
}

/* -------------------------------------
   READ BY CATEGORY
------------------------------------- */
export async function getSubCategoriesByCategory(
  categoryId: string
): Promise<SubCategoryDTO[]> {
  await db();

  const docs = await SubCategory.find({
    category: new mongoose.Types.ObjectId(categoryId),
    isActive: true,
  }).sort({ name: 1 });

  return docs.map(mapSubCategoryToDTO);
}

/* -------------------------------------
   READ SINGLE (WITHOUT POPULATE)
------------------------------------- */
export async function getSubCategoryByIdRaw(
  id: string
): Promise<SubCategoryDTO | null> {
  await db();

  const doc = await SubCategory.findById(id); // ❌ no populate

  return doc ? mapSubCategoryToDTO(doc) : null;
}

/* -------------------------------------
   READ SINGLE (WITH POPULATE)
------------------------------------- */
export async function getSubCategoryById(
  id: string
): Promise<SubCategoryDTO | null> {
  await db();

  const doc = await SubCategory.findById(id).populate(
    "category",
    "name slug"
  );

  return doc ? mapSubCategoryToDTO(doc) : null;
}


/* -------------------------------------
   UPDATE
------------------------------------- */
export async function updateSubCategory(
  id: string,
  data: CreateSubCategoryInputDTO
): Promise<SubCategoryDTO | null> {
  await db();

  const doc = await SubCategory.findByIdAndUpdate(
    id,
    {
      name: data.name,
      slug: data.slug,
      description: data.description,
      category: new mongoose.Types.ObjectId(data.categoryId),
      isActive: data.isActive,
    },
    { new: true }
  ).populate("category", "name slug");

  return doc ? mapSubCategoryToDTO(doc) : null;
}

/* -------------------------------------
   DELETE
------------------------------------- */
export async function deleteSubCategory(
  id: string
): Promise<{ success: true }> {
  await db();
  await SubCategory.findByIdAndDelete(id);
  return { success: true };
}


