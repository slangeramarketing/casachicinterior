// modules/blog/blog.actions.ts

"use server";

import { getAuthUser } from "@/lib/auth-server";
import {
  createBlogService,
  getAllBlogsService,
  getBlogBySlugService,
  updateBlogService,
  deleteBlogService,
} from "./blog.service";

import {
  BlogDTO,
  CreateBlogDTO,
} from "@/types/blogs";
import Blog from "./blog.model";

/* -------------------------------------
   Create Blog (Server Action)
------------------------------------- */
export async function createBlogAction(data: CreateBlogDTO) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  await Blog.create({
    ...data,
    author: user.id,
  });

  return { success: true }; // ✅ plain object
}


/* -------------------------------------
   Get All Blogs (Server Action)
------------------------------------- */
export async function getAllBlogsAction(): Promise<BlogDTO[]> {
  return await getAllBlogsService();
}

/* -------------------------------------
   Get Blog By Slug (Server Action)
------------------------------------- */
export async function getBlogBySlugAction(
  slug: string
): Promise<BlogDTO | null> {
  return await getBlogBySlugService(slug);
}

/* -------------------------------------
   Update Blog (Server Action)
------------------------------------- */
export async function updateBlogAction(
  id: string,
  data: Partial<CreateBlogDTO>
) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  await Blog.findByIdAndUpdate(id, data);

  return { success: true }; // ✅ plain object
}


/* -------------------------------------
   Delete Blog (Server Action)
------------------------------------- */
export async function deleteBlogAction(
  id: string
): Promise<boolean> {
  return await deleteBlogService(id);
}
