"use client";

interface SwitchToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;

  disabled?: boolean;
  label?: string;

  className?: string;
  switchClassName?: string;
  thumbClassName?: string;
}

export default function SwitchToggle({
  checked,
  onChange,
  disabled = false,
  label,
  className = "",
  switchClassName = "",
  thumbClassName = "",
}: SwitchToggleProps) {
  return (
    <div
      className={`flex items-center gap-2 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {label && (
        <span className="text-sm text-gray-600">
          {label}
        </span>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
          checked ? "bg-bg-primary" : "bg-gray-300"
        } ${switchClassName}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-1"
          } ${thumbClassName}`}
        />
      </button>
    </div>
  );
}
