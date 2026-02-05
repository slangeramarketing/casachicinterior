"use client";

/*************************************
 * ------- How to used ---------
    <ImagePicker
      label="Blog Thumbnail"
      value={thumbnail}
      onChange={setThumbnail}
      preset="blogThumbnail"
    />

    <ImagePicker
      label="Banner"
      value={banner}
      onChange={setBanner}
      preset="banner"
    />

    <ImagePicker
      label="Gallery Image"
      value={image}
      onChange={setImage}
    />

 *************************************/

import { useEffect, useState, useRef } from "react";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { processImage } from "@/lib/utils/processImage";
import { IMAGE_PRESETS } from "@/lib/config/imagePresets";

type ImagePresetKey = keyof typeof IMAGE_PRESETS;

interface ImagePickerProps {
  value: File | string | null;
  onChange: (val: File | string | null) => void;
  label?: string;
  disabled?: boolean;
  className?: string;

  /** optional */
  autoOpen?: boolean;

  /** 🔥 OPTIONAL image processing preset (only for device uploads) */
  preset?: ImagePresetKey;
}

export default function ImagePicker({
  value,
  onChange,
  label = "Image",
  disabled = false,
  className = "",
  autoOpen = false,
  preset,
}: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  const preview =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === "string"
      ? value
      : null;

  /* ===============================================
     DEVICE FILE HANDLING (ONLY HERE WE COMPRESS)
     =============================================== */
  async function handleDeviceFile(file: File) {
    let finalFile: File = file;

    // 🔒 compress ONLY if preset exists
    if (preset) {
      finalFile = await processImage(file, IMAGE_PRESETS[preset]);
    }

    onChange(finalFile);
    setOpen(false);
  }

  /* ===============================================
     UI
     =============================================== */

  return (
    <div className={`space-y-2 ${className}`}>
      {!autoOpen && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {!autoOpen && (
        <div
          className={`w-full flex flex-col border border-gray-300 rounded-lg p-3 bg-gray-50 gap-4 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen(true)}
            className="border border-gray-300 rounded bg-bg-primary text-white px-4 w-fit text-sm py-1"
          >
            Choose Image
          </button>

          {preview && (
            <div className="relative h-40">
              <OptimizedImage
                src={preview}
                alt="Preview"
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl p-6 space-y-4">
            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800">Select Image</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-xs font-bold rounded bg-gray-800 text-white"
              >
                Upload from device
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await handleDeviceFile(file);
                }}
              />
            </div>

            {/* SERVER IMAGE LIBRARY (NO COMPRESSION HERE) */}
            <ServerImageLibrary
              selected={tempSelection}
              onSelect={(url) => setTempSelection(url)}
            />

            {/* FOOTER */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-xs rounded bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!tempSelection}
                onClick={() => {
                  if (!tempSelection) return;

                  // 🔒 server image → NO processing
                  onChange(tempSelection);
                  setOpen(false);
                }}
                className="px-4 py-2 text-xs rounded bg-blue-600 text-white disabled:opacity-50"
              >
                Select Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------- */

function ServerImageLibrary({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (url: string) => void;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/uploads/list", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => d.success && setImages(d.images))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-xs text-gray-400">Loading images…</p>;
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-auto border border-gray-300 rounded-lg p-3">
      {images.map((img) => (
        <button
          key={img}
          type="button"
          onClick={() => onSelect(img)}
          className={`relative aspect-square rounded overflow-hidden border border-gray-300 ${
            selected === img ? "ring-2 ring-orange-500" : ""
          }`}
        >
          <OptimizedImage
            src={img}
            alt=""
            fill
            className="object-cover"
          />
        </button>
      ))}
    </div>
  );
}
