"use client";

import { ReactNode } from "react";

/* =========================================================
   ConfirmAlert
========================================================= */


/* =====================================
  How to used this component 

  <button onClick={() => setOpen(true)}>Delete</button>

  <ConfirmAlert
    open={open}
    title="Delete Skill"
    message="This action cannot be undone."
    icon={<Trash size={40} />}
    confirmText="Delete"
    onConfirm={() => {
      handleDelete();
      setOpen(false);
    }}
    onCancel={() => setOpen(false)}
  />

  
======================================= */

interface ConfirmAlertProps {
  open: boolean;

  title?: string;
  message: string;

  icon?: ReactNode;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void;
  onCancel: () => void;

  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  wrapperClassName?: string;
}

export function ConfirmAlert({
  open,
  title = "Are you sure?",
  message,
  icon,

  confirmText = "Confirm",
  cancelText = "Cancel",

  onConfirm,
  onCancel,

  confirmButtonClassName = "bg-red-600 text-white",
  cancelButtonClassName = "bg-gray-200 text-gray-800",
  wrapperClassName = "",
}: ConfirmAlertProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md p-6 ${wrapperClassName}`}
      >
        {/* ICON */}
        {icon && (
          <div className="flex justify-center mb-4 text-red-600">
            {icon}
          </div>
        )}

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-900 text-center">
          {title}
        </h2>

        {/* MESSAGE */}
        <p className="text-sm text-gray-600 text-center mt-2">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-md text-sm transition hover:opacity-90 ${cancelButtonClassName}`}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-sm transition hover:opacity-90 ${confirmButtonClassName}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
