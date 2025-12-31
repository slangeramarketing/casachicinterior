"use client";

import { useState } from "react";

interface TableFilterProps {
  onSearch?: (value: string) => void;
  onSort?: (order: "asc" | "desc") => void;
  defaultSort?: "asc" | "desc";
}

export default function TableFilter({
  onSearch,
  onSort,
  defaultSort = "asc",
}: TableFilterProps) {
  const [activeSort, setActiveSort] = useState<"asc" | "desc">(defaultSort);

  const handleSort = (order: "asc" | "desc") => {
    setActiveSort(order);
    onSort?.(order);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* SEARCH */}
      {onSearch && (
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full md:w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      )}

      {/* SORT */}
      {onSort && (
        <div className="flex gap-2">
          <button
            onClick={() => handleSort("asc")}
            className={`rounded-lg border px-4 py-1 text-xs cursor-pointer transition
              ${
                activeSort === "asc"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Asc
          </button>

          <button
            onClick={() => handleSort("desc")}
            className={`rounded-lg border px-4 py-1 text-xs cursor-pointer transition
              ${
                activeSort === "desc"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Desc
          </button>
        </div>
      )}
    </div>
  );
}
