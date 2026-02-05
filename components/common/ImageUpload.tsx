"use client";

/***********************************
 *     How to used
  * <ImageUpload
      label="Blog Thumbnail"
      defaultValue={post.thumbnail}
      preset="thumbnail"
      maxFileSizeMB={2}
      onChange={setThumbnail}
    />

 * ****************************/



import { useState, ChangeEvent, useEffect } from "react";
import defaultImg from "@/public/assets/default.jpg";
import { OptimizedImage } from "./OptimizedImage";
import { processImage } from "@/lib/utils/processImage";
import { IMAGE_PRESETS } from "@/lib/config/imagePresets";

type ImagePresetKey = keyof typeof IMAGE_PRESETS;

export interface ImageUploadProps {
  label?: string;
  onChange?: (file: File | null) => void;
  defaultValue?: string;

  /** 🔥 NEW */
  preset?: ImagePresetKey;
  maxFileSizeMB?: number;

  wrapperClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  fileNameClassName?: string;
  previewWrapperClassName?: string;
  previewImageClassName?: string;

  id?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  label = "Thumbnail Image",
  onChange,
  defaultValue = "",

  preset,
  maxFileSizeMB = 2,

  wrapperClassName = "",
  labelClassName = "",
  inputWrapperClassName = "",
  inputClassName = "",
  fileNameClassName = "",
  previewWrapperClassName = "",
  previewImageClassName = "",

  id = "image-upload",
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const MAX_BYTES = maxFileSizeMB * 1024 * 1024;

  /* ===============================================
     Sync defaultValue (edit mode)
     =============================================== */
  useEffect(() => {
    if (defaultValue) {
      setPreview(defaultValue);
      setFileName("");
    }
  }, [defaultValue]);

  /* ===============================================
     Cleanup blob URLs
     =============================================== */
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* ===============================================
     File Change
     =============================================== */
  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);

    const file = e.target.files?.[0];
    if (!file) {
      setPreview(defaultValue || null);
      setFileName("");
      onChange?.(null);
      return;
    }

    // Type validation
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      e.target.value = "";
      return;
    }

    // Size validation (raw file)
    if (file.size > MAX_BYTES) {
      setError(`Image must be under ${maxFileSizeMB} MB`);
      e.target.value = "";
      return;
    }

    let finalFile = file;

    // 🔥 Client-side resize/compress (only for local files)
    if (preset) {
      finalFile = await processImage(
        file,
        IMAGE_PRESETS[preset]
      );
    }

    setFileName(finalFile.name);

    const objectUrl = URL.createObjectURL(finalFile);
    setPreview(objectUrl);

    onChange?.(finalFile);
    e.target.value = "";
  }

  /* ===============================================
     UI
     =============================================== */
  return (
    <div
      className={`border border-gray-300 rounded-lg overflow-hidden ${wrapperClassName}`}
    >
      {/* HEADER */}
      <div className="flex gap-4 p-2 bg-gray-50 items-center border-b border-gray-200">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={id}
          disabled={disabled}
        />

        <label
          htmlFor={id}
          className={`inline-flex items-center gap-2 px-3 py-1.5 
            border border-gray-300 rounded-md cursor-pointer bg-white 
            hover:bg-gray-800 hover:text-white transition-all 
            text-[10px] font-bold uppercase tracking-wider
            ${inputClassName}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Choose File
        </label>

        <label
          className={`text-xs font-semibold text-gray-600 ${labelClassName}`}
        >
          {label}
        </label>
      </div>

      {/* BODY */}
      <div className={`flex flex-col bg-white ${inputWrapperClassName}`}>
        {fileName && (
          <p
            className={`px-2 py-1 text-[10px] text-blue-600 font-medium truncate ${fileNameClassName}`}
          >
            📄 {fileName}
          </p>
        )}

        {error && (
          <p className="px-2 py-1 text-[10px] text-red-500">
            {error}
          </p>
        )}

        <div
          className={`flex justify-center p-4 min-h-[150px] items-center bg-[#fcfcfc] ${previewWrapperClassName}`}
        >
          <div className="relative w-[150px] h-[100px]">
            <OptimizedImage
              src={preview || defaultImg}
              alt="Preview"
              fill
              className={`rounded border object-cover shadow-sm ${previewImageClassName}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
