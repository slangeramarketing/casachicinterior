"use server";

import { CreateBlogCategoryDTO, UpdateBlogCategoryDTO } from "@/modules/blog-category/blog-category.dto";
import { createBlogCategory, deleteBlogCategory, updateBlogCategory } from "@/modules/blog-category/blog-category.service";
import { revalidatePath } from "next/cache";

// ✅ Individual functions export karni padengi
export async function createBlogCategoryAction(data: CreateBlogCategoryDTO) {
  try {
    const result = await createBlogCategory(data);
    revalidatePath("/admin/blogs/categories");
    return { success: true, data: result, message: "Category created!", error: null };
  } catch (error: any) {
    return { success: false, error: error.message, message: null };
  }
}

export async function updateBlogCategoryAction(id: string, data: UpdateBlogCategoryDTO) {
  try {
    const result = await updateBlogCategory(id, data);
    revalidatePath("/admin/blogs/categories");
    return { success: true, data: result, message: "Category updated!", error: null };
  } catch (error: any) {
    return { success: false, error: error.message, message: null };
  }
}

export async function deleteBlogCategoryAction(id: string) {
  try {
    await deleteBlogCategory(id);
    revalidatePath("/admin/blogs/categories");
    return { success: true, message: "Category deleted successfully", error: null };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete", message: null };
  }
}