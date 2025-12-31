"use client";

import { useState } from "react";

interface CategoryChipGroupProps {
  categories: string[];
  onChange?: (category: string) => void;
}

export default function CategoryChipGroup({
  categories,
  onChange,
}: CategoryChipGroupProps) {
  const [active, setActive] = useState<string | null>(null);

  function handleClick(category: string) {
    setActive(category);
    onChange?.(category);
  }

  return (
    <div className="w-full">
      <div
        className="flex flex-wrap gap-2"
      >
        {categories.map((category) => {
          const isActive = active === category;

          return (
            <button
              key={category}
              onClick={() => handleClick(category)}
              className={`
                px-5
                inline-flex items-center justify-center
                text-xs font-medium
                text-center
                transition-all duration-200
                rounded-sm
                w-fit
                py-1
                ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-[#f3eeee] text-gray-900 hover:bg-[#e8dddd]"
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
