"use client";

import { useRef, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

type CategorySliderProps = {
  categories: string[];
  onChange?: (category: string) => void;
};

export default function CategorySlider({
  categories,
  onChange,
}: CategorySliderProps) {
  const [active, setActive] = useState(categories[0]);
  const sliderRef = useRef<HTMLDivElement>(null);

  function scrollLeft() {
    sliderRef.current?.scrollBy({ left: -220, behavior: "smooth" });
  }

  function scrollRight() {
    sliderRef.current?.scrollBy({ left: 220, behavior: "smooth" });
  }

  function handleClick(category: string) {
    setActive(category);
    onChange?.(category);
  }

  return (
    <div className="w-full flex items-center gap-3">
      {/* PREVIOUS */}
      <button
        onClick={scrollLeft}
        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition shrink-0"
      >
        <IoChevronBack size={16} />
      </button>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
      >
        {categories.map((category) => {
          const isActive = active === category;

          return (
            <button
              key={category}
              onClick={() => handleClick(category)}
              className={`
                px-4 py-1.5 rounded-full border text-sm font-medium transition
                ${
                  isActive
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-800 border-gray-300 hover:border-orange-400"
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* NEXT */}
      <button
        onClick={scrollRight}
        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition shrink-0"
      >
        <IoChevronForward size={16} />
      </button>
    </div>
  );
}
