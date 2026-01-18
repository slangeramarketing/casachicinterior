"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import defaultImg from "@/public/assets/default.jpg";

interface ImageUploadProps {
  label?: string;
  onChange?: (file: File | null) => void;
  defaultValue?: string; // 👈 Add this for Edit mode (purani image dikhane ke liye)
  // ... baaki props same rahenge
  wrapperClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  fileNameClassName?: string;
  previewWrapperClassName?: string;
  previewImageClassName?: string;
  id?: string;
}

export default function ImageUpload({
  label = "Thumbnail Image",
  onChange,
  defaultValue = "", // 👈
  wrapperClassName = "",
  labelClassName = "",
  inputWrapperClassName = "",
  inputClassName = "",
  fileNameClassName = "",
  previewWrapperClassName = "",
  previewImageClassName = "",
  id = "image-upload",
}: ImageUploadProps) {
  // Preview state ko defaultValue se initialize karein
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [fileName, setFileName] = useState<string>("");

  // Memory Leak se bachne ke liye clean-up logic
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(defaultValue || null);
      setFileName("");
      onChange?.(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    setFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onChange?.(file);
  }

  return (
    <div className={`border border-gray-300 ${wrapperClassName}`}>
      <div className="flex gap-4 p-2 bg-bg-secondary items-center">
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
        <label className={labelClassName}>{label}</label>
      </div>

      <div className={`flex flex-col ${inputWrapperClassName}`}>
        {fileName && (
          <p className={`px-2 ${fileNameClassName}`}>{fileName}</p>
        )}

        <div className={`flex justify-center p-4 ${previewWrapperClassName}`}>
          <Image
            src={preview || defaultImg}
            alt="Preview"
            width={110}
            height={120}
            className={`rounded border object-cover ${previewImageClassName}`}
          />
        </div>
      </div>
    </div>
  );
}