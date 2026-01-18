"use client";

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  showDescription?: boolean;
  activeColorClass?: string;
  levelClassName?: string;
  className?: string;
  disabled?: boolean; // 👈 Add this
}

export function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
  showDescription = true,
  activeColorClass = "bg-blue-600",
  levelClassName = "",
  className = "",
  disabled = false, // 👈 Default to false
}: ToggleSwitchProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className} ${disabled ? 'opacity-60' : ''}`}>
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
        disabled={disabled} // 👈 User submit ke waqt toggle na kar sake
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none
          ${checked ? activeColorClass : "bg-gray-300"}
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200
            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}