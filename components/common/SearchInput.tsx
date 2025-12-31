"use client";

import { ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";

/* -------------------------------------
   Types
------------------------------------- */
interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/* -------------------------------------
   Component
------------------------------------- */
export default function SearchInput({
  value,
  placeholder = "Search...",
  onChange,
  className = "",
}: SearchInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <FiSearch className="absolute left-3 top-2 lg:top-2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="
          w-full pl-10 pr-3 py-1 lg:py-1 rounded-md
          bg-white border border-gray-300
          text-gray-800 outline-none
          focus:border-[#F97316]
        "
      />
    </div>
  );
}
