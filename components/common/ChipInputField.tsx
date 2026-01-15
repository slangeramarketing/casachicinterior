"use client";

import { useState, KeyboardEvent } from "react";

/* =====================================================
   How to used
   
<ChipInputField
  label="Service Highlights"
  name="highlights"
  value={form.highlights}
  onChange={(values) =>
    setForm({ ...form, highlights: values })
  }
  placeholder="e.g. Modular kitchen, 10-year warranty"
  helperText="Press Enter or comma to add highlight"
/>

===================================================== */


/* =====================================================
   Types
===================================================== */
interface ChipInputFieldProps {
  label: string;
  name: string;

  value: string[];
  onChange: (values: string[]) => void;

  placeholder?: string;
  helperText?: string;

  labelClassName?: string;
  inputClassName?: string;
  chipsWrapperClassName?: string;
  chipClassName?: string;
}

/* =====================================================
   Component
===================================================== */
export function ChipInputField({
  label,
  name,
  value,
  onChange,

  placeholder = "Type and press Enter",
  helperText,

  labelClassName = "",
  inputClassName = "",
  chipsWrapperClassName = "",
  chipClassName = "",
}: ChipInputFieldProps) {
  const [input, setInput] = useState("");

  /* ---------------------------
     Add Chip
  --------------------------- */
  function addChip(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) return;

    onChange([...value, trimmed]);
    setInput("");
  }

  /* ---------------------------
     Remove Chip
  --------------------------- */
  function removeChip(removeValue: string) {
    onChange(value.filter((v) => v !== removeValue));
  }

  /* ---------------------------
     Keyboard Handler
  --------------------------- */
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip(input);
    }

    if (e.key === "Backspace" && !input && value.length) {
      removeChip(value[value.length - 1]);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <label className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
        {label}
      </label>

      {/* Input */}
      <input
        name={name}
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`border border-gray-300 rounded-md px-3 py-2 text-sm outline-none
          focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
      />

      {/* Helper */}
      {helperText && (
        <p className="text-xs text-gray-400">{helperText}</p>
      )}

      {/* Chips */}
      <div
        className={`min-h-[44px] border border-dotted border-gray-300 rounded-md p-2 flex flex-wrap gap-2
          ${chipsWrapperClassName}`}
      >
        {value.length === 0 && (
          <span className="text-xs text-gray-400">
            No items added yet
          </span>
        )}

        {value.map((item) => (
          <span
            key={item}
            className={`flex items-center gap-2 rounded-full
              bg-bg-primary px-3 py-1 text-xs text-white
              ${chipClassName}`}
          >
            {item}
            <button
              type="button"
              onClick={() => removeChip(item)}
              className="rounded-full bg-black/20 px-1"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
