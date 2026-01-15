"use client";

import { useMemo, useState } from "react";
import {
  ICON_PACKS,
  IconPackKey,
  resolveIcon,
} from "@/lib/utils/iconRegistry";
import { FiSearch, FiX } from "react-icons/fi";

interface IconPickerProps {
  value?: string; // e.g. "fi:FiEdit3"
  onChange: (value: string) => void;
}

export default function IconPicker({
  value = "",
  onChange,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [manual, setManual] = useState("");
  const [activePack, setActivePack] =
    useState<IconPackKey>("fi");

  /* -------------------------------------
     Parse selected icon safely
  ------------------------------------- */
  const [pack, iconName] = value
    ? (value.split(":") as [IconPackKey, string])
    : [undefined, undefined];

  const SelectedIcon =
    pack && iconName
      ? resolveIcon(pack, iconName)
      : null;

  /* -------------------------------------
     Filter icons
  ------------------------------------- */
  const iconNames = useMemo(() => {
    const icons = ICON_PACKS[activePack];
    return Object.keys(icons).filter((name) =>
      name.toLowerCase().includes(query.toLowerCase())
    );
  }, [activePack, query]);

  /* -------------------------------------
     Clear icon
  ------------------------------------- */
  function clearIcon() {
    onChange("");
    setManual("");
    setQuery("");
  }

  /* -------------------------------------
     Manual submit
  ------------------------------------- */
  function applyManual() {
    if (!manual.includes(":")) return;
    onChange(manual.trim());
    setManual("");
    setOpen(false);
  }

  return (
    <div className="relative w-full">
      {/* Selected */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex-1 flex items-center gap-3 border border-gray-300 rounded px-3 py-2 bg-white"
        >
          {SelectedIcon && (
            <SelectedIcon className="text-lg text-bg-primary" />
          )}
          <span className="text-sm text-gray-700 truncate">
            {value || "Select icon"}
          </span>
        </button>

        {/* Clear */}
        {value && (
          <button
            type="button"
            onClick={clearIcon}
            className="p-2 border rounded text-gray-500 hover:bg-red-50 hover:text-red-600"
            title="Remove icon"
          >
            <FiX />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-40 mt-2 w-full bg-white border rounded border-gray-300 shadow-lg">
          {/* Packs */}
          <div className="flex gap-2 p-2 border-b border-gray-300">
            {(Object.keys(ICON_PACKS) as IconPackKey[]).map(
              (key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePack(key)}
                  className={`px-2 py-1 text-xs rounded ${
                    activePack === key
                      ? "bg-bg-primary text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {key.toUpperCase()}
                </button>
              )
            )}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-300">
            <FiSearch className="text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search icon..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-sm outline-none"
            />
          </div>

          {/* Grid */}
          <div className="max-h-56 overflow-y-auto grid grid-cols-5 gap-2 p-3">
            {iconNames.map((name) => {
              const Icon = resolveIcon(activePack, name);
              if (!Icon) return null;

              const iconValue = `${activePack}:${name}`;

              return (
                <button
                  key={iconValue}
                  type="button"
                  onClick={() => {
                    onChange(iconValue);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded border border-gray-300 text-xs hover:bg-gray-100
                    ${
                      value === iconValue
                        ? "border-bg-primary text-bg-primary"
                        : "border-gray-200"
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

          {/* Manual input */}
          <div className="border-t border-gray-300 p-3 space-y-2">
            <input
              type="text"
              placeholder="Manual icon (e.g. fi:FiHome)"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-2 text-xs"
            />
            <button
              type="button"
              onClick={applyManual}
              className="w-full text-xs bg-bg-primary text-white py-1 rounded"
            >
              Apply icon
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
