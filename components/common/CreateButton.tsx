"use client";

import { ReactNode } from "react";
import { FiPlus } from "react-icons/fi";

interface CreateButtonProps {
  label?: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function CreateButton({
  label = "Create New",
  onClick,
  icon,
  disabled = false,
  className = "",
}: CreateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 bg-bg-primary rounded-md px-2 text-xs h-6 py-1
        ${className}
      `}
    >
      {icon ?? <FiPlus size={16} />}
      {label}
    </button>
  );
}
