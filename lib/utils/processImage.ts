// lib/utils/processImage.ts

interface ImageProcessOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number; // 0–1
  format: string;  // image/jpeg | image/webp
}

export async function processImage(
  file: File,
  options: ImageProcessOptions
): Promise<File> {
  const bitmap = await createImageBitmap(file);

  const ratio = Math.min(
    options.maxWidth / bitmap.width,
    options.maxHeight / bitmap.height,
    1
  );

  const width = Math.round(bitmap.width * ratio);
  const height = Math.round(bitmap.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // --- IMPROVEMENTS START ---
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high"; // Sabse important line quality ke liye
  // --- IMPROVEMENTS END ---

  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject("Image processing failed")),
      options.format,
      options.quality // Make sure ye value 0.7 se 0.9 ke beech ho
    );
  });

  // Filename extension fix: Format ke hisaab se extension rakhein
  const extension = options.format.split("/")[1] || "jpg";
  const newFileName = file.name.replace(/\.[^/.]+$/, "") + `.${extension}`;

  return new File([blob], newFileName, {
    type: options.format,
  });
}
