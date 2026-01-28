"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import defaultAvatar from "@/public/assets/default.jpg";

interface ProfileImageUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
}

export default function ProfileImageUpload({
  value,
  onChange,
  disabled = false,
}: ProfileImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);

  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange?.(file);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <Image
          src={preview || defaultAvatar}
          alt="Profile"
          fill
          className="rounded-full object-cover border shadow"
        />

        {!disabled && (
          <label
            htmlFor="profile-upload"
            className="absolute bottom-1 right-1 bg-black text-white 
                       rounded-full w-7 h-7 flex items-center 
                       justify-center cursor-pointer text-xs"
          >
            ✎
          </label>
        )}
      </div>

      <input
        type="file"
        id="profile-upload"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
