import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "common";

    if (!file) {
      console.error("[Upload API] No file provided.");
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    console.log(`[Upload API] Received file: ${file.name}, Size: ${file.size}, Type: ${file.type}, Target Folder: ${type}`);

    if (!file.type.startsWith("image/")) {
      console.error(`[Upload API] Invalid file type: ${file.type}`);
      return NextResponse.json(
        { success: false, message: "Only images allowed" },
        { status: 400 }
      );
    }

    // 📁 Upload directory
    const UPLOAD_ROOT =
      process.env.UPLOAD_ROOT ??
      path.join(process.cwd(), "public", "uploads");

    const uploadDir = path.join(UPLOAD_ROOT, type);
    console.log(`[Upload API] Uploading to directory: ${uploadDir}`);

    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const fileName = `${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);
    console.log(`[Upload API] File saved locally at: ${filePath}`);

    // ✅ IMPORTANT PART
    const baseUrl = await getBaseUrl();
    const fileUrl = `${baseUrl}/uploads/${type}/${fileName}`;

    console.log(`[Upload API] Upload successful. Public URL: ${fileUrl}`);

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
