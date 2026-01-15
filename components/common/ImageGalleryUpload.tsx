"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import defaultImg from "@/public/assets/default.jpg";

/***************************************************
 * ImageGalleryUpload
 *
 * Purpose:
 * - Reusable multi-image upload with preview gallery
 *
 * Features:
 * - Supports existing image URLs (edit mode)
 * - Supports new file previews (create / replace)
 * - Grid-based gallery preview
 * - Remove individual images
 *
 * Rules:
 * - File previews override URL previews
 * - UI-only (no upload logic)
 ***************************************************/

/* *****************************************
   How to Used this component 
  -----------------------------

  const [images, setImages] = useState<File[]>([]);

    <ImageGalleryUpload
        label="Project Gallery"
        value={images}
        initialPreviews={initialData?.images || []}
        onChange={setImages}
        maxFiles={8}
    />

*************************************************/

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

  wrapperClassName = "",
  labelClassName = "",
  buttonClassName = "",
  gridClassName = "",
  imageClassName = "",
}: ImageGalleryUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (!files.length) return;

    const merged = [...value, ...files].slice(0, maxFiles);
    onChange(merged);
  }

  function handleRemove(index: number) {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  }

  /* 🔁 Handle preview sources */
  useEffect(() => {
    // If new files exist → generate previews
    if (value.length) {
      const urls = value.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }

    // Fallback to initial URLs
    setPreviews(initialPreviews);
  }, [value, initialPreviews]);

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

      {/* GALLERY */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 ${gridClassName}`}
      >
        {previews.length === 0 && (
          <Image
            src={defaultImg}
            alt="Placeholder"
            width={120}
            height={120}
            className="object-cover rounded border"
          />
        )}

        {previews.map((src, index) => (
          <div key={index} className="relative group">
            <Image
              src={src}
              alt={`Preview ${index + 1}`}
              width={150}
              height={150}
              className={`object-cover rounded border ${imageClassName}`}
            />

            {/* REMOVE BUTTON */}
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
