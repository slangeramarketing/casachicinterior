/***************************************************
 * File: modules/blogs/blog.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Next.js server-side adapter for Blog module.
 * - Acts as the single entry point for UI (Server Components) and Actions.
 *
 * Responsibilities:
 * - Coordination between Service and Mapper.
 * - Perform auth & role checks (Admin logic goes here).
 * - Cache revalidation via revalidatePath.
 *
 * Restrictions:
 * - No "use server" at the top (due to object export).
 * - Must NOT access repository directly.
 * - Must NOT return raw database objects.
 ***************************************************/
/***************************************************
 * File: modules/blogs/blog.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Next.js server-side adapter for Blog module.
 * - Acts as the single entry point for UI (Server Components) and Actions.
 *
 * Responsibilities:
 * - Coordination between Service and Mapper.
 * - Perform auth & role checks (Admin logic goes here).
 * - Cache revalidation via revalidatePath.
 *
 * Restrictions:
 * - No "use server" at the top (due to object export).
 * - Must NOT access repository directly.
 * - Must NOT return raw database objects.
 ***************************************************/

import { revalidatePath } from "next/cache";
import { 
  getAllBlogs, 
  getBlogBySlug, 
  createBlog, 
  updateBlog, 
  deleteBlog, 
  getBlogById
} from "./blog.service";
import { BlogResponseDTO, CreateBlogDTO, UpdateBlogDTO } from "./blog.dto";
import { BlogMapper } from "./blog.mapper";
import { requireRole } from "@/lib/auth";

/**
 * Blog Server Facade Object
 */
export const blogServer = {
  /**
   * Purpose: Fetch all blogs for Admin/Public list
   */
  async getAll(filters: any = {}):Promise<
  | { success: true; data: BlogResponseDTO[] }
  | { success: false; error: string }> {
    try {
      const records = await getAllBlogs(filters);
      
      // Boundary Mapping: IPopulatedBlogRecord[] -> BlogResponseDTO[]
      const data = BlogMapper.toResponseList(records);
      
      return { success: true, data };
    } catch (error: any) {
      console.error("[BLOG_SERVER_GETALL_ERROR]:", error);
      return { success: false, error: error.message || "Failed to fetch blogs" };
    }
  },

  /**
   * Purpose: Fetch single blog detail by slug
   */
  async getBySlug(slug: string) {
    try {
      const record = await getBlogBySlug(slug);
      
      // Boundary Mapping: IPopulatedBlogRecord -> BlogResponseDTO
      const data = BlogMapper.toResponse(record);
      
      return { success: true, data };
    } catch (error: any) {
      console.error("[BLOG_SERVER_GETSLUG_ERROR]:", error);
      return { success: false, error: error.message || "Blog not found" };
    }
  },

  /**
   * Purpose: Fetch single blog by ID and map to DTO
   * Useful for Admin Edit pages where ID is used in the URL
   */
  async getById(id: string) {
    try {
      const record = await getBlogById(id); // Service layer call
      
      if (!record) {
        return { success: false, error: "Blog not found" };
      }

      // Boundary Mapping: IBlogRecord/IPopulatedBlogRecord -> BlogResponseDTO
      // 'as any' casting to handle potential population mismatch in TypeScript
      const data = BlogMapper.toResponse(record as any);
      
      return { success: true, data };
    } catch (error: any) {
      console.error("[BLOG_SERVER_GETBYID_ERROR]:", error);
      return { success: false, error: error.message || "Failed to fetch blog by ID" };
    }
  },

  async create(data: CreateBlogDTO) {
    try {
      // 🔐 AUTH + RBAC
      const auth = await requireRole(["super_admin"]);

      const record = await createBlog(auth.role, data);

      revalidatePath("/blogs");
      revalidatePath("/admin/blogs");

      return {
        success: true,
        data: BlogMapper.toResponse(record as any),
      };
    } catch (error: any) {
      console.error("[BLOG_SERVER_CREATE_ERROR]:", error);
      return { success: false, error: error.message };
    }
  },

  async update(id: string, data: UpdateBlogDTO) {
    try {
      const auth = await requireRole(["super_admin"]);

      const record = await updateBlog(auth.role, id, data);

      revalidatePath("/blogs");
      revalidatePath(`/blogs/${record.slug}`);
      revalidatePath("/admin/blogs");

      return {
        success: true,
        data: BlogMapper.toResponse(record as any),
      };
    } catch (error: any) {
      console.error("[BLOG_SERVER_UPDATE_ERROR]:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Purpose: Delete blog and cleanup cache
   */
  async delete(id: string) {
    try {
      const auth = await requireRole(["super_admin"]);

      await deleteBlog(auth.role, id);

      revalidatePath("/blogs");
      revalidatePath("/admin/blogs");

      return { success: true };
    } catch (error: any) {
      console.error("[BLOG_SERVER_DELETE_ERROR]:", error);
      return { success: false, error: error.message };
    }
  }

};