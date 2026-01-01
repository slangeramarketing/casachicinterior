"use client";

import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

export type AlertType = "success" | "error";

interface AlertProps {
  type: AlertType;
  title: string;
  description?: string;
  onClose: () => void;
}

export default function Alert({
  type,
  title,
  description,
  onClose,
}: AlertProps) {
  const isSuccess = type === "success";

  return (
    <div
      className={`
        fixed top-6 right-6 z-[9999]
        w-[320px] rounded-xl border p-4 shadow-lg
        animate-slide-in
        ${isSuccess
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 text-xl ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {isSuccess ? <FiCheckCircle /> : <FiAlertCircle />}
        </div>

        <div className="flex-1">
          <p
            className={`font-semibold ${
              isSuccess ? "text-green-800" : "text-red-800"
            }`}
          >
            {title}
          </p>

          {description && (
            <p className="text-sm text-gray-600 mt-1">
              {description}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
}
