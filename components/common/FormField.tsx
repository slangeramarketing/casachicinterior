"use client";

import { ChangeEvent } from "react";

/* =========================================================
   Shared Types
========================================================= */

interface BaseFieldProps {
  label: string;
  name?: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  labelClassName?:string;
  className?: string;
  optionsClassName?:string
}

/* =========================================================
   TextField
========================================================= */

interface TextFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "password" | "number";
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function TextField({
  label,
  name="",
  value,
  placeholder='',
  type = "text",
  disabled = false,
  onChange=()=>{},
  labelClassName,
  className = "",
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        className={`border border-gray-300  rounded-md px-3 py-2 text-sm outline-none
          focus:ring-2 focus:ring-gray-500
          disabled:bg-gray-100 ${className}`}
      />
    </div>
  );
}

/* =========================================================
   SelectField
========================================================= */

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps extends BaseFieldProps {
  options: SelectOption[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function SelectField({
  label,
  name,
  value,
  options,
  disabled = false,
  onChange,
  labelClassName,
  optionsClassName,
  className = "",
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
        {label}
      </label>

      <select
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`border border-gray-300 rounded-md px-3 py-2 text-sm outline-none
          focus:ring-2 focus:ring-gray-500 bg-transparent ${className}`}
      >
        <option value="" disabled className={optionsClassName}>
          Select option
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className={optionsClassName}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   TextAreaField (with character counter)
========================================================= */

interface TextAreaFieldProps extends BaseFieldProps {
  maxLength?: number;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextAreaField({
  label,
  name,
  value,
  placeholder,
  maxLength = 200,
  disabled = false,
  onChange,
  labelClassName,
  className = "",
}: TextAreaFieldProps) {
  const isOverLimit = value.length > maxLength;

  return (
    <div className="flex flex-col gap-1 scroll-hide">
      <label className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
        {label}
      </label>

        <textarea
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => {
                onChange(e);

                // 🔹 Auto resize logic
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            className={`border border-gray-300 rounded-md px-3 py-2 text-sm outline-none resize-none
                focus:ring-2 focus:ring-gray-500
                disabled:bg-gray-100
                overflow-y-hidden
                ${isOverLimit ? "border-red-500" : ""}
                ${className}`}
            rows={3}
        />


      {/* Character Counter */}
      <div
        className={`text-xs px-2 text-gray-300 ${
          isOverLimit ? "text-red-600" : "text-gray-500"
        }`}
      >
        {value.length} / {maxLength} characters
      </div>
    </div>  
  );
}
