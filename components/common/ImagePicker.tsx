"use client";

import { useEffect, useState, useRef } from "react";
import { OptimizedImage } from "@/components/common/OptimizedImage";

interface ImagePickerProps {
  value: File | string | null;
  onChange: (val: File | string | null) => void;
  label?: string;
  disabled?: boolean;
  className?:string;
}

export default function ImagePicker({
  value,
  onChange,
  label = "Image",
  disabled = false,
  className=""
}: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preview =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === "string"
      ? value
      : null;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* LABEL */}
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {/* PREVIEW + OPEN MODAL */}
      
      <div className={`w-full flex-col border border-gray-300 rounded-lg p-3 flex  bg-gray-50 hover:bg-gray-100 transition gap-4 ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(true)}
                className="border border-gray-300 rounded bg-bg-primary text-white px-4 w-fit text-sm py-1"

            >
                Choose Image
            </button>
          {preview ? (
            <div className="relative h-40">
                <OptimizedImage src={preview} alt="Preview" fill className="object-cover rounded-md" />
            </div>
            ) : ""}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl p-6 space-y-4">
            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800">Select Image</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-black">✕</button>
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
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  onChange(file);
                  setOpen(false);
                }}
              />
            </div>

            {/* SERVER LIBRARY */}
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

  if (loading) return <p className="text-xs text-gray-400">Loading images…</p>;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-auto border border-gray-300 rounded-lg p-3">
      {images.map((img) => (
        <button
          key={img}
          type="button"
          onClick={() => onSelect(img)}
          className={`relative aspect-square rounded overflow-hidden border border-gray-300 ${
            selected === img ? "ring-3 ring-orange-500" : ""
          }`}
        >
          <OptimizedImage src={img} alt="" fill className="object-cover" />
        </button>
      ))}
    </div>
  );
}
