"use client";

import { ReactNode } from "react";

/* =========================================================
   ToggleSwitch
========================================================= */

/* 
 ========= Basic Use =========
    <ToggleSwitch
        label="Publish Blog"
        description="This blog will be visible to the public."
        checked={isPublished}
        onChange={setIsPublished}
    />

 ========== Custom active color Use =========
    <ToggleSwitch
        label="Enable Notifications"
        checked={enabled}
        onChange={setEnabled}
        activeColorClass="bg-green-600"
    />


 ========= Hide description Use =========
    <ToggleSwitch
        label="Enable Notifications"
        checked={enabled}
        onChange={setEnabled}
        activeColorClass="bg-green-600"
    />

*/

interface ToggleSwitchProps {
  label: string;
  description?: string;

  checked: boolean;
  onChange: (value: boolean) => void;

  showDescription?: boolean;

  activeColorClass?: string; // e.g. bg-blue-600
  levelClassName?:string;
  className?: string;
}

export function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
  showDescription = true,
  activeColorClass = "bg-blue-600",
  levelClassName="",
  className = "",
}: ToggleSwitchProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      {/* TEXT SECTION */}
      <div className="flex flex-col">
        <span className={`text-sm font-medium text-gray-800 ${levelClassName}`}>
          {label}
        </span>

        {description && showDescription && (
          <p className="text-xs text-gray-500 mt-1 max-w-sm">
            {description}
          </p>
        )}
      </div>

      {/* SWITCH */}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition
          ${checked ? activeColorClass : "bg-gray-300"}
        `}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition
            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}
