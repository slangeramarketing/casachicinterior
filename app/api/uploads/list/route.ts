import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const UPLOAD_ROOT =path.join(process.cwd(), "public", "uploads");

// const UPLOAD_ROOT =
//   process.env.UPLOAD_ROOT || "/var/www/casachic/uploads";

/**
 * Recursively read files from directory
 */
async function readDirRecursive(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return readDirRecursive(fullPath);
      }

      // allow only images
      if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
        return fullPath;
      }

      return [];
    })
  );

  return files.flat();
}

export async function GET() {
  try {
    const files = await readDirRecursive(UPLOAD_ROOT);

    // filesystem path → public URL
    const urls = files.map((filePath) =>
      filePath.replace(UPLOAD_ROOT, "/uploads")
    );

    return NextResponse.json({
      success: true,
      images: urls,
    });
  } catch (err) {
    console.error("UPLOAD LIST ERROR:", err);
    return NextResponse.json(
      { success: false, images: [] },
      { status: 500 }
    );
  }
}
