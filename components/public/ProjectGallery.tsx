"use client";


import { useState } from "react";
import { OptimizedImage } from "../common/OptimizedImage";

type Props = {
  images: string[];
};

export default function ProjectGallery({ images }: Props) {
  // 🔒 safety fallback
  const validImages = images.filter(Boolean);
  const [active, setActive] = useState(0);

  if (validImages.length === 0) {
    return (
      <div className="h-[420px] w-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
        No project images available
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* MAIN IMAGE */}
      <div className="relative w-full h-[420px] rounded-xl overflow-hidden bg-gray-100">
        <OptimizedImage
          src={validImages[active]}
          alt="Project image"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 flex-wrap">
        {validImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`relative w-24 h-16 rounded-md overflow-hidden border ${
              active === index
                ? "border-orange-500"
                : "border-gray-300"
            }`}
          >
            <OptimizedImage
              src={img}
              alt="thumbnail"
              fill
              sizes="96px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
