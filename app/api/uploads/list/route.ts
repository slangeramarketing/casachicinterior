import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

/**
 * UPLOAD ROOT
 * - Local dev   → project/public/uploads
 * - Production  → absolute server path (env)
 */
const UPLOAD_ROOT =
  process.env.UPLOAD_ROOT
    ? process.env.UPLOAD_ROOT
    : path.join(process.cwd(), "public", "uploads");


/**
 * Public URL prefix
 * - Local: /uploads/...
 * - Production: same (served via nginx or public mapping)
 */
const PUBLIC_PREFIX = "/uploads";

/**
 * Recursively read image files
 */
async function readDirRecursive(dir: string): Promise<string[]> {
  let results: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        results = results.concat(await readDirRecursive(fullPath));
      } else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(entry.name)) {
        results.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`[Upload List API] Warning reading directory ${dir}:`, error);
  }

  return results;
}

export async function GET() {
  try {
    console.log(`[Upload List API] Starting file list scan. Root: ${UPLOAD_ROOT}`);

    // 🔒 ensure folder exists
    await fs.access(UPLOAD_ROOT);

    const files = await readDirRecursive(UPLOAD_ROOT);
    console.log(`[Upload List API] Found ${files.length} files.`);

    /**
     * Convert filesystem path → public URL
     * /var/www/app/uploads/services/a.jpg
     * → /uploads/services/a.jpg
     */
    const images = files.map((filePath) =>
      filePath
        .replace(UPLOAD_ROOT, PUBLIC_PREFIX)
        .replace(/\\/g, "/") // Windows safety
    );

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("[Upload List API] LIST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        images: [],
      },
      { status: 500 }
    );
  }
}
