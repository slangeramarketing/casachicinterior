import { NextRequest } from "next/server";
import {
  getBlogBySlugController,
  updateBlogController,
  deleteBlogController,
} from "@/modules/blogs/blog.controller";

/* -------------------------------------
   GET: Single Blog (by slug or id)
------------------------------------- */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getBlogBySlugController(params.id);
}

/* -------------------------------------
   PUT: Update Blog (admin, super_admin)
------------------------------------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateBlogController(req, params.id);
}

/* -------------------------------------
   DELETE: Delete Blog (super_admin)
------------------------------------- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteBlogController(req, params.id);
}
