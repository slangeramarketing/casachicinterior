import Category, { ICategory } from "./category.model";

export async function createCategory(data: Partial<ICategory>) {
  return Category.create(data);
}

/* -------------------------------------
   Admin – ALL categories
------------------------------------- */
export async function getAllCategories() {
  return Category.find().sort({ createdAt: -1 });
}

/* -------------------------------------
   Public – only ACTIVE categories
------------------------------------- */
export async function getActiveCategories() {
  return Category.find({ isActive: true }).sort({ createdAt: -1 });
}

export async function getCategoryById(id: string) {
  return Category.findById(id);
}

export async function getCategoryBySlug(slug: string) {
  return Category.findOne({ slug, isActive: true });
}

export async function updateCategory(id: string, data: Partial<ICategory>) {
  return Category.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteCategory(id: string) {
  return Category.findByIdAndDelete(id);
}

