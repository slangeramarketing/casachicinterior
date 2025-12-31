"use client";

import { useState } from "react";
import { FiFilter } from "react-icons/fi";

export type FilterOption<T extends string> = {
  label: string;
  value: T;
};

interface FilterDropdownProps<T extends string> {
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
}

export default function FilterDropdown<T extends string>({
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || "New";

  return (
    <div className="relative inline-block">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-1.5 border border-[#F97316] text-[#F97316] rounded-md text-sm bg-white"
      >
        <FiFilter size={16} />
        {selectedLabel}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-[#F2F2F2] rounded-md shadow-md z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-white ${
                value === opt.value
                  ? "font-semibold text-black"
                  : "text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
