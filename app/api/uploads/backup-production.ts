// Production api/uploads/.. route.ts file 


import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "common";

    console.log("API FILE UPLOAD DATA: ",file);
    console.log("API FILE UPLOAD TYPE DATA: ",type);

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only images allowed" },
        { status: 400 }
      );
    }

    // 📁 uploads/blogs | uploads/projects
    const UPLOAD_ROOT = process.env.UPLOAD_ROOT!;
    const uploadDir = path.join(UPLOAD_ROOT, type);


    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const fileName = `${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${type}/${fileName}`;
     console.log("FILE URL: ",fileUrl);

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
