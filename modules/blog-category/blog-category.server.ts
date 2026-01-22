/***************************************************
 * File: modules/blog-category/blog-category.server.ts
 * Layer: Server Facade (Server Actions Boundary)
 ***************************************************/
import { 
  getAllCategories, 
  createBlogCategory, 
  updateBlogCategory, 
  deleteBlogCategory, 
  getCategoryBySlug,
  getCategoryById
} from "./blog-category.service";
import { CreateBlogCategoryDTO, UpdateBlogCategoryDTO } from "./blog-category.dto";
import { blogCategoryMapper } from "./blog-category.mapper";

export const blogCategoryServer = {
  /**
   * 1. Tree Structure: Categories ko hierarchy mein laane ke liye
   */
  async getTree() {
    try {
      const records = await getAllCategories(); // Service returns IBlogCategoryRecord[]
      
      // Step A: Records ko DTOs mein badlo (id, isSubCategory yahan add honge)
      const dtoList = blogCategoryMapper.toResponseList(records);
      
      // Step B: Flat DTOs ko Tree structure mein convert karo
      const tree = blogCategoryMapper.toTree(dtoList);
      
      return { success: true, data: tree };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to fetch category tree" };
    }
  },

  /**
   * 2. Flat List: Dropdowns ya simple tables ke liye
   */
  async getList() {
    try {
      const records = await getAllCategories();
      const data = blogCategoryMapper.toResponseList(records);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to fetch categories" };
    }
  },

  /**
   * Slug se fetch karke DTO return karega
   */
  async getBySlug(slug: string) {
    try {
      const record = await getCategoryBySlug(slug);
      if (!record) return { success: false, error: "Category not found" };

      return { 
        success: true, 
        data: blogCategoryMapper.toResponse(record) 
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * ID se fetch karke DTO return karega
   */
  async getById(id: string) {
    try {
      const record = await getCategoryById(id);
      if (!record) return { success: false, error: "Category not found" };

      return { 
        success: true, 
        data: blogCategoryMapper.toResponse(record) 
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * 3. Create: Nayi category banana
   */
  async create(data: CreateBlogCategoryDTO) {
    try {
      const record = await createBlogCategory(data);
      // Mapping record to DTO for UI
      return { success: true, data: blogCategoryMapper.toResponse(record) };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to create category" };
    }
  },

  /**
   * 4. Update: Existing category ko badalna
   */
  async update(id: string, data: UpdateBlogCategoryDTO) {
    try {
      const record = await updateBlogCategory(id, data);
      return { success: true, data: blogCategoryMapper.toResponse(record) };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to update category" };
    }
  },

  /**
   * 5. Delete: Category hatana
   */
  async delete(id: string) {
    try {
      const result = await deleteBlogCategory(id);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to delete category" };
    }
  }
};