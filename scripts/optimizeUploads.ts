/***************************************************
 * File: scripts/optimizeUploads.ts
 * Purpose:
 * - One-off optimiser for images that were uploaded BEFORE upload-time
 *   optimisation existed (app/api/uploads/route.ts). The live hero image
 *   was a 4.6 MB JPEG; this brings such files down to a few hundred KB.
 * - Files keep their exact name and extension, so nothing stored in the
 *   database (coverImage, gallery, thumbnails) has to change.
 *
 * Usage (run on the server, inside the app folder):
 *   npx tsx scripts/optimizeUploads.ts                 # dry run: report only
 *   npx tsx scripts/optimizeUploads.ts --apply         # rewrite files, keep backups
 *   npx tsx scripts/optimizeUploads.ts --apply --min-kb=200 --max-width=1920
 *
 * Safety:
 * - Dry run by default. Nothing is written without --apply.
 * - With --apply every rewritten file is first copied to
 *   <UPLOAD_ROOT>/../uploads-backup-<date>/ with the same relative path.
 * - A file is only replaced when the optimised version is smaller.
 * - SVG and GIF are skipped.
 ***************************************************/

import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const MIN_KB = Number(args.find((a) => a.startsWith("--min-kb="))?.split("=")[1] ?? 200);
const MAX_WIDTH = Number(args.find((a) => a.startsWith("--max-width="))?.split("=")[1] ?? 1920);
const QUALITY = 80;

const UPLOAD_ROOT = process.env.UPLOAD_ROOT ?? path.join(process.cwd(), "public", "uploads");
const BACKUP_ROOT = path.join(
  path.dirname(UPLOAD_ROOT),
  `uploads-backup-${new Date().toISOString().slice(0, 10)}`
);

const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function optimise(file: string): Promise<Buffer | null> {
  const ext = path.extname(file).toLowerCase();
  const pipeline = sharp(file, { failOn: "none" })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true });

  if (ext === ".png") return pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
  if (ext === ".webp") return pipeline.webp({ quality: QUALITY }).toBuffer();
  return pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
}

async function main() {
  console.log(`Upload root : ${UPLOAD_ROOT}`);
  console.log(`Mode        : ${APPLY ? "APPLY (files will be rewritten, backups kept)" : "DRY RUN"}`);
  console.log(`Threshold   : files larger than ${MIN_KB} KB, max width ${MAX_WIDTH}px\n`);

  let scanned = 0;
  let candidates = 0;
  let before = 0;
  let after = 0;

  for await (const file of walk(UPLOAD_ROOT)) {
    const ext = path.extname(file).toLowerCase();
    if (!SUPPORTED.has(ext)) continue;
    scanned++;

    const stat = await fs.stat(file);
    if (stat.size < MIN_KB * 1024) continue;

    const optimised = await optimise(file);
    if (!optimised || optimised.length >= stat.size) continue;

    candidates++;
    before += stat.size;
    after += optimised.length;

    const rel = path.relative(UPLOAD_ROOT, file);
    console.log(
      `${APPLY ? "rewrite" : "would rewrite"}  ${rel}  ${(stat.size / 1024).toFixed(0)} KB -> ${(optimised.length / 1024).toFixed(0)} KB`
    );

    if (APPLY) {
      const backup = path.join(BACKUP_ROOT, rel);
      await fs.mkdir(path.dirname(backup), { recursive: true });
      await fs.copyFile(file, backup);
      await fs.writeFile(file, optimised);
    }
  }

  console.log(`\nScanned ${scanned} images, ${candidates} ${APPLY ? "rewritten" : "would be rewritten"}.`);
  if (candidates) {
    console.log(`Total ${(before / 1024 / 1024).toFixed(1)} MB -> ${(after / 1024 / 1024).toFixed(1)} MB`);
  }
  if (APPLY && candidates) console.log(`Backups in ${BACKUP_ROOT}`);
}

main().catch((err) => {
  console.error("optimizeUploads failed:", err);
  process.exit(1);
});
