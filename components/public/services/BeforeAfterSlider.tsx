"use client";

/***************************************************
 * File: components/public/services/BeforeAfterSlider.tsx
 * Layer: UI – Client Component
 *
 * Purpose:
 * - Interactive Framer Motion Before/After image comparison slider.
 * - Drag the divider to reveal the transformation.
 ***************************************************/

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImg: string;
  afterImg: string;
  title: string;
}

export default function BeforeAfterSlider({
  beforeImg,
  afterImg,
  title,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50); // percent
  const isDragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 2), 98));
  }, []);

  // Mouse events
  const onMouseDown = () => {
    isDragging.current = true;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    updateSlider(e.clientX);
  };
  const onMouseUp = () => {
    isDragging.current = false;
  };

  // Touch events
  const onTouchMove = (e: React.TouchEvent) => {
    updateSlider(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden rounded-2xl cursor-col-resize"
      style={{ minHeight: "420px" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      {/* AFTER image (full width, base layer) */}
      <div className="absolute inset-0">
        <Image
          src={afterImg}
          alt={`After – ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />
        {/* After Label */}
        <span className="absolute bottom-4 right-4 bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          After
        </span>
      </div>

      {/* BEFORE image (clipped to sliderPos) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <Image
          src={beforeImg}
          alt={`Before – ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />
        {/* Before Label */}
        <span className="absolute bottom-4 left-4 bg-gray-900/80 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Before
        </span>
      </div>

      {/* Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      />

      {/* Drag Handle */}
      <motion.div
        className="absolute z-30 top-1/2 flex items-center justify-center"
        style={{ left: `${sliderPos}%`, translateX: "-50%", translateY: "-50%" }}
        onMouseDown={onMouseDown}
        onTouchStart={() => { isDragging.current = true; }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-12 h-12 rounded-full bg-white shadow-2xl border-4 border-[#F97316] flex items-center justify-center gap-1 cursor-grab active:cursor-grabbing">
          <div className="flex gap-[3px]">
            <span className="text-[#F97316] text-sm font-black">◀</span>
            <span className="text-[#F97316] text-sm font-black">▶</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
