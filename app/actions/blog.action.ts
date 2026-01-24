"use server";

import { CreateBlogDTO, UpdateBlogDTO } from "@/modules/blogs/blog.dto";
import { createBlog, deleteBlog, updateBlog } from "@/modules/blogs/blog.service";
import { revalidatePath } from "next/cache";

export async function createBlogPostAction(data: CreateBlogDTO) {
  try {
    const result = await createBlog(data);
    revalidatePath("/admin/blogs/posts");
    return { success: true, data: result, message: "Blog published!", error: null };
  } catch (error: any) {
    return { success: false, error: error.message, message: null };
  }
}

export async function updateBlogPostAction(id: string, data: UpdateBlogDTO) {
  try {
    const result = await updateBlog(id, data);
    revalidatePath("/admin/blogs/posts");
    return { success: true, data: result, message: "Blog updated!", error: null };
  } catch (error: any) {
    return { success: false, error: error.message, message: null };
  }
}

export async function deleteBlogPostAction(id: string) {
  try {
    await deleteBlog(id);
    revalidatePath("/admin/blogs");
    return { success: true, message: "Blog deleted!", error: null };
  } catch (error: any) {
    return { success: false, error: error.message, message: null };
  }
}