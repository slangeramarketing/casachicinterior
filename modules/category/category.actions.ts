"use server"
import { revalidatePath } from "next/cache";
import { createCategory, updateCategory, deleteCategory } from "./category.service";



export async function createCategoryAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "true";

    await createCategory({
      name,
      slug,
      description,
      isActive,
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    // ✅ Handle duplicate key error
    if (error.code === 11000) {
      if (error.keyPattern?.slug) {
        return {
          success: false,
          message: "Slug already exists. Please use a different name.",
        };
      }

      if (error.keyPattern?.name) {
        return {
          success: false,
          message: "Category name already exists.",
        };
      }
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}



export async function updateCategoryAction(
  id: string,
  formData: FormData
) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "true";

    await updateCategory(id, {
      name,
      slug,
      description,
      isActive,
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return {
        success: false,
        message: "Category with this name/slug already exists.",
      };
    }

    return {
      success: false,
      message: "Update failed. Please try again.",
    };
  }
}



export async function deleteCategoryAction(id: string) {
  await deleteCategory(id);
  revalidatePath("/admin/categories");
}
