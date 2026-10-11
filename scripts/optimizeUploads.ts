/***************************************************
 * File: scripts/optimizeUploads.ts
 * Purpose:
 * - One-off optimiser for images uploaded BEFORE upload-time optimisation
 *   existed (app/api/uploads/route.ts). Large originals (the live hero was
 *   4.6 MB) are resized to a sensible width and recompressed.
 * - Files keep their exact name and extension, so nothing stored in the
 *   database (coverImage, gallery, thumbnails) has to change.
 *
 * Usage (run on the server, inside the app folder):
 *   npx tsx scripts/optimizeUploads.ts                     # dry run: report only
 *   npx tsx scripts/optimizeUploads.ts --apply             # rewrite files, keep backups
 *   npx tsx scripts/optimizeUploads.ts --apply --min-kb=200 --max-width=1920
 *   npx tsx scripts/optimizeUploads.ts --apply --backup-dir=/home/slangera/upload-backups
 *
 * Safety:
 * - Dry run by default. Nothing is written without --apply.
 * - Every rewritten file is first copied to a NEW timestamped backup folder
 *   (default ~/casachic-upload-backups/<timestamp>/), outside public/ so the
 *   backups are never served by the site or cached by the service worker.
 *   An existing backup file is never overwritten.
 * - A file is only replaced when the result is at least 15% smaller, so
 *   running the script again does not keep recompressing the same images.
 * - JPEG/WebP are recompressed (quality 80); PNG stays lossless (no colour
 *   quantisation, so photos saved as PNG do not get banding).
 * - Animated images, SVG and GIF are skipped.
 ***************************************************/

import "dotenv/config";
import fs from "fs/promises";
import { constants as fsConstants } from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";

const args = process.argv.slice(2);
const argValue = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");

const APPLY = args.includes("--apply");
const MIN_KB = Number(argValue("min-kb") ?? 200);
const MAX_WIDTH = Number(argValue("max-width") ?? 1920);
const QUALITY = 80;
const MIN_SAVING_RATIO = 0.85;

const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_ROOT ?? path.join(process.cwd(), "public", "uploads"));
const STAMP = new Date().toISOString().replace(/[:.]/g, "-");
const BACKUP_ROOT = path.resolve(
  argValue("backup-dir") ?? path.join(os.homedir(), "casachic-upload-backups"),
  STAMP
);

const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function isInside(child: string, parent: string): boolean {
  const rel = path.relative(parent, child);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function optimise(file: string): Promise<Buffer | null> {
  const ext = path.extname(file).toLowerCase();
  const meta = await sharp(file, { failOn: "none" }).metadata();
  if ((meta.pages ?? 1) > 1) return null; // animated: keep as-is

  const pipeline = sharp(file, { failOn: "none" })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true });

  if (ext === ".png") return pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  if (ext === ".webp") return pipeline.webp({ quality: QUALITY }).toBuffer();
  return pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
}

async function main() {
  const publicDir = path.resolve(process.cwd(), "public");
  if (APPLY && (isInside(BACKUP_ROOT, publicDir) || isInside(BACKUP_ROOT, UPLOAD_ROOT))) {
    console.error(`Refusing to write backups inside public/ or the upload folder: ${BACKUP_ROOT}`);
    process.exit(1);
  }

  console.log(`Upload root : ${UPLOAD_ROOT}`);
  console.log(`Mode        : ${APPLY ? "APPLY (files will be rewritten, backups kept)" : "DRY RUN"}`);
  console.log(`Threshold   : files larger than ${MIN_KB} KB, max width ${MAX_WIDTH}px, at least ${Math.round((1 - MIN_SAVING_RATIO) * 100)}% smaller`);
  if (APPLY) console.log(`Backups     : ${BACKUP_ROOT}`);
  console.log("");

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

    let optimised: Buffer | null = null;
    try {
      optimised = await optimise(file);
    } catch (err) {
      console.warn(`skip (unreadable) ${path.relative(UPLOAD_ROOT, file)}:`, err instanceof Error ? err.message : err);
      continue;
    }
    if (!optimised || optimised.length > stat.size * MIN_SAVING_RATIO) continue;

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
      try {
        await fs.copyFile(file, backup, fsConstants.COPYFILE_EXCL);
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
      }
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
