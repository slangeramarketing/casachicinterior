"use client";

import { useEffect, useState, ChangeEvent } from "react";
import defaultImg from "@/public/assets/default.jpg";
import { OptimizedImage } from "./OptimizedImage";
import { processImage } from "@/lib/utils/processImage";
import { IMAGE_PRESETS } from "@/lib/config/imagePresets";

/***************************************************
 * ImageGalleryUpload (UPDATED)
 *
 * Purpose:
 * - Reusable multi-image upload with preview gallery
 *
 * Features:
 * - Supports existing image URLs (edit mode)
 * - Supports new file previews (create / replace)
 * - Optional client-side resize & compression
 * - File type + size validation
 * - Grid-based gallery preview
 * - Remove individual images
 *
 * Rules:
 * - File previews override URL previews
 * - Server images are NOT re-processed
 ***************************************************/

/* *****************************************
   Example Usage

  <ImageGalleryUpload
    label="Service Gallery"
    value={files}
    initialPreviews={service.gallery}
    onChange={setFiles}
    maxFiles={8}
    preset="gallery"
  />

*************************************************/

type ImagePresetKey = keyof typeof IMAGE_PRESETS;

interface ImageGalleryUploadProps {
  label?: string;

  /** Newly selected files */
  value?: File[];

  /** Existing image URLs (edit mode) */
  initialPreviews?: string[];

  onChange: (files: File[]) => void;

  id?: string;
  accept?: string;
  maxFiles?: number;

  /** 🔥 NEW */
  preset?: ImagePresetKey;
  maxFileSizeMB?: number;

  wrapperClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  gridClassName?: string;
  imageClassName?: string;
}

export default function ImageGalleryUpload({
  label = "Upload Images",
  value = [],
  initialPreviews = [],
  onChange,

  id = "image-gallery-upload",
  accept = "image/*",
  maxFiles = 6,

  preset,
  maxFileSizeMB = 2,

  wrapperClassName = "",
  labelClassName = "",
  buttonClassName = "",
  gridClassName = "",
  imageClassName = "",
}: ImageGalleryUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const MAX_BYTES = maxFileSizeMB * 1024 * 1024;

  /* ===============================
     File Select
     =============================== */
  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);

    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const processedFiles: File[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        continue;
      }

      if (file.size > MAX_BYTES) {
        setError(`Each image must be under ${maxFileSizeMB} MB`);
        continue;
      }

      let finalFile = file;

      // 🔥 Only process local files when preset is provided
      if (preset) {
        finalFile = await processImage(
          file,
          IMAGE_PRESETS[preset]
        );
      }

      processedFiles.push(finalFile);
    }

    if (!processedFiles.length) return;

    const merged = [...value, ...processedFiles].slice(
      0,
      maxFiles
    );

    onChange(merged);
    e.target.value = "";
  }

  /* ===============================
     Remove
     =============================== */
  function handleRemove(index: number) {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  }

  /* ===============================
     Preview handling
     =============================== */
  useEffect(() => {
    if (value.length) {
      const urls = value.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }

    setPreviews(initialPreviews);
  }, [value, initialPreviews]);

  /* ===============================
     UI
     =============================== */
  return (
    <div className={`border rounded-md ${wrapperClassName}`}>
      {/* HEADER */}
      <div className="flex items-center gap-3 p-2 bg-bg-secondary">
        <input
          id={id}
          type="file"
          accept={accept}
          multiple
          hidden
          onChange={handleChange}
        />

        <label
          htmlFor={id}
          className={`px-3 py-1 text-xs border rounded cursor-pointer
            hover:bg-bg-primary hover:text-white ${buttonClassName}`}
        >
          Choose Images
        </label>

        <span className={`text-sm ${labelClassName}`}>
          {label} ({previews.length}/{maxFiles})
        </span>
      </div>

      {error && (
        <p className="text-xs text-red-500 px-3 pt-2">
          {error}
        </p>
      )}

      {/* GALLERY */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 ${gridClassName}`}
      >
        {previews.length === 0 && (
          <OptimizedImage
            src={defaultImg}
            alt="Placeholder"
            width={120}
            height={120}
            className="object-cover rounded border"
          />
        )}

        {previews.map((src, index) => (
          <div key={index} className="relative group">
            <OptimizedImage
              src={src}
              alt={`Preview ${index + 1}`}
              width={150}
              height={150}
              className={`object-cover rounded border ${imageClassName}`}
            />

            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 text-xs bg-black/70
                text-white px-2 py-0.5 rounded opacity-0
                group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
