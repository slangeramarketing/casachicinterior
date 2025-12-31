import { NextRequest, NextResponse } from "next/server";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "./category.service";

import { authenticate, authorize } from "@/modules/user/user.middleware";

/* -------------------------------------
   GET: All Categories (Public / Auth)
------------------------------------- */
export async function getAllCategoriesController() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

/* -------------------------------------
   GET: Category By ID (Public / Auth)
------------------------------------- */
export async function getCategoryByIdController(id: string) {
  try {
    const category = await getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      { message: "Invalid category id" },
      { status: 400 }
    );
  }
}

/* -------------------------------------
   POST: Create Category (ADMIN, SUPER_ADMIN)
------------------------------------- */
export async function createCategoryController(req: NextRequest) {
  try {
    const user = authenticate(req);
    authorize(user, ["super_admin", "admin"]);

    const body = await req.json();
    const category = await createCategory(body);

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Unauthorized" },
      { status: 403 }
    );
  }
}

/* -------------------------------------
   PUT: Update Category (ADMIN, SUPER_ADMIN)
------------------------------------- */
export async function updateCategoryController(req: NextRequest) {
  try {
    const user = authenticate(req);
    authorize(user, ["super_admin", "admin"]);

    const { id, ...data } = await req.json();
    const updated = await updateCategory(id, data);

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Unauthorized" },
      { status: 403 }
    );
  }
}

/* -------------------------------------
   DELETE: Delete Category (ADMIN, SUPER_ADMIN)
------------------------------------- */
export async function deleteCategoryController(req: NextRequest) {
  try {
    const user = authenticate(req);
    authorize(user, ["super_admin", "admin"]);

    const { id } = await req.json();
    await deleteCategory(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Unauthorized" },
      { status: 403 }
    );
  }
}
