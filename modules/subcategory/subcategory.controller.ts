import { NextResponse } from "next/server";
import {
  createSubCategory,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory,
} from "./subcategory.service";

export async function POST(req: Request) {
  const body = await req.json();
  const subCategory = await createSubCategory(body);

  return NextResponse.json(subCategory, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  if (!categoryId) {
    return NextResponse.json(
      { error: "categoryId required" },
      { status: 400 }
    );
  }

  const subCategories = await getSubCategoriesByCategory(categoryId);
  return NextResponse.json(subCategories);
}

export async function PUT(req: Request) {
  const { id, ...data } = await req.json();
  const updated = await updateSubCategory(id, data);

  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await deleteSubCategory(id);

  return NextResponse.json({ success: true });
}
