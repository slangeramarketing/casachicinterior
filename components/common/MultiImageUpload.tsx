"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import defaultImg from "@/public/media/static/default.jpg";

interface MultiImageUploadProps {
  label?: string;
  onChange?: (files: File[]) => void;

  /* Styling hooks */
  wrapperClassName?: string;
  wrapperHeaderClassName?:string
  labelClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  previewGridClassName?: string;
  previewImageClassName?: string;
}

export default function MultiImageUpload({
  label = "Gallery Images",
  onChange,

  wrapperClassName = "",
  wrapperHeaderClassName="",
  labelClassName = "",
  inputWrapperClassName = "",
  inputClassName = "",
  previewGridClassName = "",
  previewImageClassName = "",

}: MultiImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== selectedFiles.length) {
      alert("Only image files are allowed");
      return;
    }

    const newPreviews = imageFiles.map((file) =>
      URL.createObjectURL(file)
    );

    const updatedFiles = [...files, ...imageFiles];
    const updatedPreviews = [...previews, ...newPreviews];

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onChange?.(updatedFiles);
  }

  function removeImage(index: number) {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onChange?.(updatedFiles);
  }

  return (
    <div className={`border border-gray-300 rounded ${wrapperClassName}`}>
      <div className={`bg-bg-secondary px-4 py-2 ${wrapperHeaderClassName}`}>
        {/* Label */}
        <label className={labelClassName}>
            {label}
        </label>

        {/* Upload Button */}
        <div className={inputWrapperClassName}>
            <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="multi-image-upload"
            />

            <label
            htmlFor="multi-image-upload"
            className={`inline-flex items-center gap-2 px-3 py-1
                border border-gray-300 rounded cursor-pointer bg-bg-secondary
                hover:bg-bg-primary hover:text-white text-xs ${inputClassName}`}
            >
            Choose Images
            </label>
        </div>
      </div>

      {/* Preview Grid */}
      <div
        className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-2 ${previewGridClassName}`}
      >
        {previews.length === 0 && (
          <div className="col-span-full flex justify-center">
            <Image
              src={defaultImg}
              alt="Empty"
              width={100}
              height={100}
              className="rounded opacity-50"
            />
          </div>
        )}

        {previews.map((src, index) => (
          <div
            key={index}
            className="relative group border border-gray-300 rounded overflow-hidden"
          >
            <Image
              src={src}
              alt={`Preview ${index}`}
              width={150}
              height={150}
              className={`object-cover w-full h-full ${previewImageClassName}`}
            />

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-black/70 text-white
                         text-xs px-2 py-1 rounded opacity-0
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
