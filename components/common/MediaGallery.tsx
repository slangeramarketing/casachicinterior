"use client";

import { useEffect, useState } from "react";

type MediaGalleryProps = {
  children: React.ReactNode[];
  itemsPerView?: number;
  gap?: number;
};

export function MediaGallery({
  children,
  itemsPerView = 1,
  gap = 16,
}: MediaGalleryProps) {
  const [index, setIndex] = useState(0);

  const total = children.length;
  const slideWidth = 100 / itemsPerView;
  const maxIndex = Math.max(total - itemsPerView, 0);
  const canScroll = total > itemsPerView;

  // 🔥 IMPORTANT FIX: index clamp on responsive change
  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex);
    }
  }, [itemsPerView, total, maxIndex, index]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          gap,
          transform: `translateX(-${index * slideWidth}%)`,
        }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{ width: `${slideWidth}%` }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* LEFT */}
      {canScroll && index > 0 && (
        <button
          onClick={() => setIndex((i) => i - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-2 shadow hover:bg-white transition"
        >
          ←
        </button>
      )}

      {/* RIGHT */}
      {canScroll && index < maxIndex && (
        <button
          onClick={() => setIndex((i) => i + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-2 shadow hover:bg-white transition"
        >
          →
        </button>
      )}
    </div>
  );
}
