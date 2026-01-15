import { NextRequest } from "next/server";
import {
  updateCategoryController,
  deleteCategoryController,
  getCategoryByIdController,
} from "@/modules/blog-category/category.controller";


/* -------------------------------------
   GET: Category by ID
------------------------------------- */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getCategoryByIdController(params.id);
}



/* -------------------------------------
   PUT: Update Category (by ID)
------------------------------------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // attach id to body so existing controller can reuse logic
  const body = await req.json();
  req.json = async () => ({ ...body, id: params.id });

  return updateCategoryController(req);
}

/* -------------------------------------
   DELETE: Delete Category (by ID)
------------------------------------- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // attach id to body for controller
  req.json = async () => ({ id: params.id });

  return deleteCategoryController(req);
}
