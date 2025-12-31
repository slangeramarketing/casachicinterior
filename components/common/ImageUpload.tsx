"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import defaultImg from "@/public/media/static/default.jpg";

interface ImageUploadProps {
  label?: string;
  onChange?: (file: File | null) => void;

  /* Styling hooks */
  wrapperClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  fileNameClassName?: string;
  previewWrapperClassName?: string;
  previewImageClassName?: string;
  emptyPreviewClassName?: string;
  id?:string;
}

export default function ImageUpload({

  label = "Thumbnail Image",
  onChange,

  wrapperClassName = "",
  labelClassName = "",
  inputWrapperClassName = "",
  inputClassName = "",
  fileNameClassName = "",
  previewWrapperClassName = "",
  previewImageClassName = "",
  emptyPreviewClassName = "",
  id = "image-upload",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(null);
      setFileName("");
      onChange?.(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    onChange?.(file);
  }

  return (
    <div className={`border border-gray-300 ${wrapperClassName}`}>

      <div className="flex gap-4 p-2 bg-bg-secondary">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={id}
        />
        <label
          htmlFor={id}
          className={`inline-flex items-center gap-2 px-3 py-1
                      border border-gray-300 rounded cursor-pointer bg-bg-secondary
                      hover:bg-bg-primary hover:text-white text-xs ${inputClassName}`}
        >
          Choose-File
        </label>
        {/* Label */}
        <label className={labelClassName}>
          {label}
        </label>
        
      </div>

      {/* Input Box */}
      <div className={`flex flex-col ${inputWrapperClassName}`}>
        {/* File Name */}
        {fileName && (
          <p className={`px-2 ${fileNameClassName}`}>
            {fileName}
          </p>
        )}

        {/* Preview */}
        <div className={`flex justify-center p-4 ${previewWrapperClassName}`}>
          <Image
            src={preview || defaultImg}   // 👈 fallback to default image
            alt="Preview"
            width={110}
            height={120}
            className={`rounded border ${previewImageClassName}`}
          />
        </div>
      </div>
    </div>
  );
}
