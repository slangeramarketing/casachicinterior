import { NextRequest, NextResponse } from "next/server";
import {
  getAllBlogsController,
  createBlogController,
} from "@/modules/blogs/blog.controller";

/* -------------------------------------
   GET: All Blogs (Public)
------------------------------------- */
export async function GET() {
  return getAllBlogsController();
}

/* -------------------------------------
   POST: Create Blog (Admin only)
------------------------------------- */
export async function POST(req: NextRequest) {
  return createBlogController(req);
}
