import { NextRequest } from "next/server";
import {
  getAllCategoriesController,
  createCategoryController,
} from "@/modules/blog-category/category.controller";

/* -------------------------------------
   GET: All Categories
------------------------------------- */
export async function GET() {
  return getAllCategoriesController();
}

/* -------------------------------------
   POST: Create Category
------------------------------------- */
export async function POST(req: NextRequest) {
  return createCategoryController(req);
}
