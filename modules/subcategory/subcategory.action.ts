"use server";

import { revalidatePath } from "next/cache";
import {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "./subcategory.service";
import { CreateSubCategoryInputDTO } from "@/types/subCategory";

/* -------------------------------------
   CREATE
------------------------------------- */
export async function createSubCategoryAction(formData: FormData) {
  try {
    const payload: CreateSubCategoryInputDTO = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      categoryId: formData.get("categoryId") as string,
      isActive: formData.get("isActive") === "true",
    };

    await createSubCategory(payload);

    revalidatePath("/admin/blogs/sub-categories");
    return { success: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return {
        success: false,
        message:
          "Sub-category with this name or slug already exists under this category.",
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

/* -------------------------------------
   UPDATE
------------------------------------- */
export async function updateSubCategoryAction(
  id: string,
  formData: FormData
) {
  try {
    const payload: CreateSubCategoryInputDTO = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      categoryId: formData.get("categoryId") as string,
      isActive: formData.get("isActive") === "true",
    };

    await updateSubCategory(id, payload);

    revalidatePath("/admin/blogs/sub-categories");
    return { success: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return {
        success: false,
        message:
          "Sub-category with this name or slug already exists under this category.",
      };
    }

    return {
      success: false,
      message: "Update failed. Please try again.",
    };
  }
}

/* -------------------------------------
   DELETE
------------------------------------- */
export async function deleteSubCategoryAction(id: string) {
  await deleteSubCategory(id);
  revalidatePath("/admin/blogs/sub-categories");
}
