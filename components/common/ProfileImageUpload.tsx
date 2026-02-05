"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import defaultAvatar from "@/public/assets/default.jpg";

interface ProfileImageUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

export default function ProfileImageUpload({
  value,
  onChange,
  disabled = false,
}: ProfileImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);

    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Type validation
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      e.target.value = "";
      return;
    }

    // ✅ Size validation
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be less than 2 MB");
      e.target.value = "";
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
          sizes="112px"
          className="rounded-full object-cover border shadow"
        />

        {!disabled && (
          <label
            htmlFor="profile-upload"
            className="absolute bottom-1 right-1 bg-black text-white
                       rounded-full w-7 h-7 flex items-center
                       justify-center cursor-pointer text-xs"
            title="Change image"
          >
            ✎
          </label>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 text-center max-w-[180px]">
          {error}
        </p>
      )}

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
