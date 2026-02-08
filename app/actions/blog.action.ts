"use server";

import { CreateBlogDTO, UpdateBlogDTO } from "@/modules/blogs/blog.dto";
import { blogServer } from "@/modules/blogs/blog.server";
import { createBlog, deleteBlog, updateBlog } from "@/modules/blogs/blog.service";
import { revalidatePath } from "next/cache";

export async function createBlogPostAction(data: CreateBlogDTO) {
  try {
    console.log("[ACTION] createBlogPostAction started", { slug: data.slug, title: data.title });
    const result = await blogServer.create(data);
    console.log("[ACTION] blogServer.create finished", { success: result.success });
    revalidatePath("/admin/blogs/posts");
    console.log("[ACTION] revalidatePath finished");
    return { success: true, data: result, message: "Blog published!", error: null };
  } catch (error: any) {
    console.error("[ACTION] createBlogPostAction error", error);
    return { success: false, error: error.message, message: null };
  }
}

export async function updateBlogPostAction(id: string, data: UpdateBlogDTO) {
  try {
    const result = await blogServer.update(id, data);
    revalidatePath("/admin/blogs/posts");
    return { success: true, data: result, message: "Blog updated!", error: null };
  } catch (error: any) {
    return { success: false, error: error.message, message: null };
  }
}

export async function deleteBlogPostAction(id: string) {
  try {
    await blogServer.delete(id);
    revalidatePath("/admin/blogs");
    return { success: true, message: "Blog deleted!", error: null };
  } catch (error: any) {
    return { success: false, error: error.message, message: null };
  }
}