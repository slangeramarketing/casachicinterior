"use client";

/* =====================================================
   How to Used

   const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message?: string;
   } | null>(null);

   try {
    await onSubmit(formData);

    setAlert({
        type: "success",
        title: "Category saved",
        message: "Your changes have been saved successfully.",
    });
    } catch (err) {
    setAlert({
        type: "error",
        title: "Something went wrong",
        message: "Please try again or check the form inputs.",
    });
    }

    {alert && (
    <Alert
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert(null)}
    />
    )}



===================================================== */

import { useState } from "react";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

/* =====================================================
   Types
===================================================== */

export interface AlertType{
  type: "success" | "error";
  title: string;
  message?: string;
}


interface AlertProps {
  type: "success" | "error";
  title: string;
  message?: string;
  onClose?: () => void;
}

/* =====================================================
   Component
===================================================== */
export default function Alert({
  type,
  title,
  message,
  onClose,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {/* Icon */}
      <div className="mt-0.5">
        {isSuccess ? (
          <FiCheckCircle size={18} />
        ) : (
          <FiAlertTriangle size={18} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {message && (
          <p className="mt-0.5 text-xs opacity-90">
            {message}
          </p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="rounded p-1 opacity-70 hover:opacity-100"
        aria-label="Close alert"
      >
        <FiX size={16} />
      </button>
    </div>
  );
}
