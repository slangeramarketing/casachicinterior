"use client";

/***************************************************
 * File: components/public/services/HeroBeforeAfterSlider.tsx
 * Layer: UI – Client Component
 * 
 * SCOPED HERO FIX:
 * - Specific version for Hero section with aspect ratio handling.
 * - 'Before' image uses 'object-cover' to fill gaps in raw renders.
 * - 'object-bottom' (bottom center) maps to floor/furniture detail.
 ***************************************************/

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroBeforeAfterSliderProps {
  beforeImg: string;
  afterImg: string;
  title: string;
}

export default function HeroBeforeAfterSlider({
  beforeImg,
  afterImg,
  title,
}: HeroBeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50); // percent
  const isDragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 0), 100));
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
      className="relative w-full h-full select-none overflow-hidden rounded-[2.5rem] cursor-col-resize bg-[#090F1A]"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
    >
      {/* ── AFTER image (Background Layer) ── */}
      <div className="absolute inset-0 w-full h-full">
        {/* Blurred Backdrop */}
        <Image
          src={afterImg}
          alt=""
          fill
          className="object-cover scale-110 blur-[120px] opacity-100 brightness-[0.2]"
          priority
        />
        {/* Foreground Content */}
        <Image
          src={afterImg}
          alt={`After – ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-contain"
          priority
        />
        {/* After Label - Ultra Minimalist */}
        <div className="absolute bottom-3 right-3 z-10 bg-white/5 backdrop-blur-sm text-white/50 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-[0.4em] border border-white/5">
          After
        </div>
      </div>

      {/* ── BEFORE image (Foreground Layer) ── SCUPED FIX HERE */}
      <div
        className="absolute inset-0 w-full h-full z-10 overflow-hidden"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)` 
        }}
      >
        {/* Blurred Backdrop */}
        <Image
          src={beforeImg}
          alt=""
          fill
          className="object-cover scale-110 blur-[120px] opacity-100 brightness-[0.2]"
          priority
        />
        {/* Foreground Content - SET TO OBJECT-COVER FOR HERO */}
        <Image
          src={beforeImg}
          alt={`Before – ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover object-bottom" // FIX: COVER to fill gaps in raw renders
          priority
        />
        {/* Before Label - Ultra Minimalist */}
        <div className="absolute bottom-3 left-3 z-10 bg-black/10 backdrop-blur-sm text-white/50 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-[0.4em] border border-white/5">
          Before
        </div>
      </div>

      {/* Slider Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-[1px] bg-white/30 backdrop-blur-sm z-20"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[4px] bg-orange-500/10 blur-sm" />
      </div>

      {/* Interactive Handle - Minimalist */}
      <motion.div
        className="absolute z-30 top-1/2 -translate-y-1/2 -translate-x-1/2"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={() => { isDragging.current = true; }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20 flex items-center justify-center cursor-grab active:cursor-grabbing">
          <div className="flex gap-2.5 items-center">
            <span className="text-[#F97316] text-[8px] font-black">❮</span>
            <div className="w-[1px] h-3 bg-gray-200" />
            <span className="text-[#F97316] text-[8px] font-black">❯</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
