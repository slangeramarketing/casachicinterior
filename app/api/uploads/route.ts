import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

/**
 * Image upload endpoint used by the dashboard.
 *
 * Images are optimised at upload time so that the public site never
 * serves multi-megabyte originals (the live hero image was 4.6 MB):
 * - resized to fit within a per-folder maximum width (never upscaled)
 * - re-encoded as WebP (quality 82), which keeps transparency
 * - EXIF orientation applied, other metadata stripped
 *
 * If optimisation fails for any reason the original bytes are stored
 * unchanged, so an unusual file never blocks an upload.
 */

const MAX_WIDTH_BY_TYPE: Record<string, number> = {
  profile: 512,
  blogs: 1920,
  projects: 1920,
  services: 1920,
  common: 1920,
};

const WEBP_QUALITY = 82;

/** Minimum saving before a file that does not need resizing is re-encoded. */
const MIN_SAVING_RATIO = 0.9;

/**
 * Returns the optimised WebP, or null when the original should be kept:
 * - animated images (animated WebP/APNG): re-encoding would keep only frame 1
 * - images already within the size limit where WebP saves under 10%
 *   (typically files the dashboard already compressed in the browser;
 *   re-encoding those would only add generation loss)
 */
async function optimiseImage(
  input: Buffer,
  type: string
): Promise<{ buffer: Buffer; ext: string } | null> {
  const maxWidth = MAX_WIDTH_BY_TYPE[type] ?? 1920;

  const meta = await sharp(input, { failOn: "none" }).metadata();
  if ((meta.pages ?? 1) > 1) return null;

  const buffer = await sharp(input, { failOn: "none" })
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const needsResize = (meta.width ?? 0) > maxWidth;
  if (!needsResize && buffer.length >= input.length * MIN_SAVING_RATIO) return null;

  return { buffer, ext: ".webp" };
}

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

    const original = Buffer.from(await file.arrayBuffer());

    let output: { buffer: Buffer; ext: string } = {
      buffer: original,
      ext: path.extname(file.name).toLowerCase() || ".jpg",
    };
    if (file.type !== "image/svg+xml" && file.type !== "image/gif") {
      try {
        const optimised = await optimiseImage(original, type);
        if (optimised) {
          output = optimised;
          console.log(
            `[Upload API] Optimised ${file.name}: ${original.length} -> ${output.buffer.length} bytes (webp)`
          );
        } else {
          console.log(`[Upload API] Kept original ${file.name} (animated, or already optimised)`);
        }
      } catch (err) {
        console.warn("[Upload API] Optimisation failed, storing original:", err);
      }
    }

    const fileName = `${Date.now()}${output.ext}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, output.buffer);
    console.log(`[Upload API] File saved locally at: ${filePath}`);

    // Site-relative URL: works on every hostname (production, staging, local)
    // instead of baking the uploading host into the database record.
    const fileUrl = `/uploads/${type}/${fileName}`;

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
