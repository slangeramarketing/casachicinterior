

"use client";

import before from "@/public/assets/HomeRenovationBefor.png"
import after from "@/public/assets/HomeRenovationAfter.png"
import React, { useState, useRef } from "react";
import Image from "next/image";
import { OptimizedImage } from "../common/OptimizedImage";

const PortfolioShowcase: React.FC = () => {
  const [dividerPosition, setDividerPosition] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return; // only move when dragging
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let x = 0;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
    } else {
      x = e.clientX - rect.left;
    }

    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setDividerPosition(percent);
  };

  const startDrag = () => setIsDragging(true);
  const stopDrag = () => setIsDragging(false);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
          Portfolio & Showcase
        </h2>
        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
          Explore our recent projects — see the transformation from problem to solution.
        </p>

        {/* Before/After Slider */}
        <div
          ref={containerRef}
          className="relative mt-12 w-full h-[400px] overflow-hidden rounded-lg shadow-lg select-none"
          onMouseMove={handleMove}
          onTouchMove={handleMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchEnd={stopDrag}
        >
          {/* Before Image */}
          <OptimizedImage
            src={before}
            alt="Before"
            fill
            className="object-cover"
          />

          {/* After Image (clipped by divider) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${dividerPosition}%` }}
          >
            <OptimizedImage
              src={after}
              alt="After"
              fill
              className="object-cover"
            />
          </div>

          {/* Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-indigo-600"
            style={{ left: `${dividerPosition}%`, transform: "translateX(-50%)" }}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow cursor-col-resize">
              ⇔
            </div>
          </div>

          {/* Labels */}
          <span className="absolute top-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
            Before
          </span>
          <span className="absolute top-2 right-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
            After
          </span>
        </div>

        {/* Case Study Text */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Modern Living Room Transformation
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Problem:</strong> Outdated furniture and poor lighting made the space dull.
            </li>
            <li>
              <strong>Solution:</strong> Introduced modular furniture, warm lighting, and minimalistic decor.
            </li>
            <li>
              <strong>Result:</strong> A vibrant, cozy living room with improved functionality.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PortfolioShowcase;
