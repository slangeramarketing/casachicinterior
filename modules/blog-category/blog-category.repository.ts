import { BlogCategoryModel } from "./blog-category.model";
import { CreateBlogCategoryDTO, UpdateBlogCategoryDTO } from "./blog-category.dto";
import db from "@/lib/db";

// Hum repository ka structure explicitly define kar rahe hain
export const blogCategoryRepository = {
  async findAll() {
    await db();
    return await BlogCategoryModel.find()
      .populate("parentId", "name slug")
      .sort({ displayOrder: 1, name: 1 })
      .lean();
  },

  async findBySlug(slug: string) {
    await db();
    return await BlogCategoryModel.findOne({ slug }).lean();
  },

  async findById(id: string) {
    await db();
    return await BlogCategoryModel.findById(id).populate("parentId").lean();
  },

  async create(data: CreateBlogCategoryDTO) {
    await db();
    const doc = await BlogCategoryModel.create(data);
    return doc.toObject();
  },

  async update(id: string, data: UpdateBlogCategoryDTO) {
    await db();
    return await BlogCategoryModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
  },

  // 👇 Ensure karein ki ye method yahan maujood hai
  async delete(id: string) {
    await db();
    // Sub-category check logic
    const hasChildren = await BlogCategoryModel.findOne({ parentId: id });
    if (hasChildren) {
      throw new Error("Cannot delete category that has sub-categories");
    }
    return await BlogCategoryModel.findByIdAndDelete(id).lean();
  }
};