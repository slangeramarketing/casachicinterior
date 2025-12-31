// modules/blog/blog.service.ts

import Blog from "./blog.model";
import {
  BlogDTO,
  CreateBlogDTO,
  mapBlogToDTO,
  mapBlogsToDTO,
} from "@/types/blogs";

/* -------------------------------------
   Create Blog
------------------------------------- */
export async function createBlogService(
  data: CreateBlogDTO
): Promise<BlogDTO> {
  try {
    const blog = await Blog.create(data);
    return mapBlogToDTO(blog);
  } catch (error) {
    console.error("Create Blog Error:", error);
    throw new Error("Failed to create blog");
  }
}

/* -------------------------------------
   Get All Blogs ✅ FIXED
------------------------------------- */
export async function getAllBlogsService(): Promise<BlogDTO[]> {
  try {
    const blogs = await Blog.find().populate("author", "name avatar").sort({ createdAt: -1 });
    return mapBlogsToDTO(blogs); // ✅ correct
  } catch (error) {
    console.error("Get All Blogs Error:", error);
    throw new Error("Failed to fetch blogs");
  }
}

/* -------------------------------------
   Get Blog By Slug
------------------------------------- */
export async function getBlogBySlugService(
  slug: string
): Promise<BlogDTO | null> {
  try {
    const blog = await Blog.findOne({ slug });
    return blog ? mapBlogToDTO(blog) : null;
  } catch (error) {
    console.error("Get Blog By Slug Error:", error);
    throw new Error("Failed to fetch blog");
  }
}

/* -------------------------------------
   Get Blog By ID (READ)
------------------------------------- */
export async function getBlogById(id: string) {
  return await Blog.findById(id).populate("author", "name avatar");
}

/* -------------------------------------
   Update Blog
------------------------------------- */
export async function updateBlogService(
  id: string,
  data: Partial<CreateBlogDTO>
): Promise<BlogDTO | null> {
  try {
    const blog = await Blog.findByIdAndUpdate(id, data, { new: true });
    return blog ? mapBlogToDTO(blog) : null;
  } catch (error) {
    console.error("Update Blog Error:", error);
    throw new Error("Failed to update blog");
  }
}

/* -------------------------------------
   Delete Blog
------------------------------------- */
export async function deleteBlogService(
  id: string
): Promise<boolean> {
  try {
    return !!(await Blog.findByIdAndDelete(id));
  } catch (error) {
    console.error("Delete Blog Error:", error);
    throw new Error("Failed to delete blog");
  }
}
