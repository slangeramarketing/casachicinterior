"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import defaultImg from "@/public/assets/default.jpg";
import { OptimizedImage } from "./OptimizedImage";

export interface ImageUploadProps {
  label?: string;
  onChange?: (file: File | null) => void;
  defaultValue?: string;
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
  // 1. Initial state setup
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [fileName, setFileName] = useState<string>("");

  // 🔥 FIX 1: Jab defaultValue change ho (Edit mode mein data aaye), tab preview update karo
  useEffect(() => {
    if (defaultValue) {
      setPreview(defaultValue);
    }
  }, [defaultValue]);

  // Memory Leak clean-up
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
    
    // 🔥 FIX 2: Naya object URL create karke state update
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl); 
    onChange?.(file);
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${wrapperClassName}`}>
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
                      hover:bg-gray-800 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider ${inputClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Choose File
        </label>
        <label className={`text-xs font-semibold text-gray-600 ${labelClassName}`}>{label}</label>
      </div>

      <div className={`flex flex-col bg-white ${inputWrapperClassName}`}>
        {fileName && (
          <p className={`px-2 py-1 text-[10px] text-blue-600 font-medium truncate ${fileNameClassName}`}>
            📄 {fileName}
          </p>
        )}

        <div className={`flex justify-center p-4 min-h-[150px] items-center bg-[#fcfcfc] ${previewWrapperClassName}`}>
          <div className="relative w-[150px] h-[100px]">
             <OptimizedImage
              src={preview || defaultImg}
              alt="Preview"
              fill // 🔥 'fill' use karne se layout flexible rehta hai
              className={`rounded border object-cover shadow-sm ${previewImageClassName}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}