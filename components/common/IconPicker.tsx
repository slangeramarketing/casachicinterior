"use client";

import { useMemo, useState } from "react";
import {
  ICON_PACKS,
  IconPackKey,
  resolveIcon,
} from "@/lib/utils/iconRegistry";
import { FiSearch } from "react-icons/fi";

interface IconPickerProps {
  value: string; // e.g. "fi:FiEdit3"
  onChange: (value: string) => void;
}

export default function IconPicker({
  value,
  onChange,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activePack, setActivePack] =
    useState<IconPackKey>("fi");

  /* -------------------------------------
     Parse selected value safely
  ------------------------------------- */
  const [pack, iconName] = value
    ? (value.split(":") as [IconPackKey, string])
    : [activePack, ""];

  const SelectedIcon =
    pack && iconName
      ? resolveIcon(pack, iconName)
      : null;

  /* -------------------------------------
     Filter icons by search
  ------------------------------------- */
  const iconNames = useMemo(() => {
    const packIcons = ICON_PACKS[activePack];
    return Object.keys(packIcons).filter((name) =>
      name.toLowerCase().includes(query.toLowerCase())
    );
  }, [activePack, query]);

  return (
    <div className="relative w-full">
      {/* Selected button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 border border-gray-300 rounded px-3 py-2 bg-white"
      >
        {SelectedIcon && (
          <SelectedIcon className="text-lg text-orange-500" />
        )}
        <span className="text-sm text-gray-700 truncate">
          {value || "Select icon"}
        </span>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg">
          {/* Pack selector */}
          <div className="flex gap-2 p-2 border-b">
            {(Object.keys(ICON_PACKS) as IconPackKey[]).map(
              (key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePack(key)}
                  className={`px-2 py-1 text-xs rounded ${
                    activePack === key
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {key.toUpperCase()}
                </button>
              )
            )}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <FiSearch className="text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search icon..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-sm outline-none"
            />
          </div>

          {/* Icon grid */}
          <div className="max-h-64 overflow-y-auto grid grid-cols-5 gap-2 p-3">
            {iconNames.length === 0 && (
              <p className="col-span-5 text-xs text-gray-400 text-center">
                No icons found
              </p>
            )}

            {iconNames.map((name) => {
              const Icon = resolveIcon(activePack, name);
              const iconValue = `${activePack}:${name}`;

              if (!Icon) return null;

              return (
                <button
                  key={iconValue}
                  type="button"
                  onClick={() => {
                    onChange(iconValue);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded border text-xs hover:bg-gray-100
                    ${
                      value === iconValue
                        ? "border-orange-500 text-orange-600"
                        : "border-gray-200 text-gray-600"
                    }`}
                >
                  <Icon className="text-lg" />
                  <span className="truncate w-full text-center">
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
