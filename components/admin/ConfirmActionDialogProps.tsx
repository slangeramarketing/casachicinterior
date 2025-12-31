"use client";

import { ReactNode, useState } from "react";

interface ConfirmActionDialogProps {
  /** Button / icon that opens dialog */
  trigger: ReactNode;

  /** Dialog content */
  title: string;
  description?: string;

  /** Confirm button text */
  confirmText?: string;

  /** Cancel button text */
  cancelText?: string;

  /** Server action (or async fn) */
  action: () => Promise<void>;

  /** Optional styles */
  danger?: boolean; // delete / destructive action
}

export default function ConfirmActionDialog({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  action,
  danger = false,
}: ConfirmActionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await action();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <span
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </span>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white shadow-lg animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-5 pt-5">
              <h3 className="text-base font-semibold text-gray-900">
                {title}
              </h3>

              {description && (
                <p className="mt-2 text-sm text-gray-600 text-wrap">
                  {description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3 px-5 pb-5">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="border px-4 py-2 text-sm rounded hover:bg-gray-50"
              >
                {cancelText}
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`
                  px-4 py-2 text-sm rounded text-white
                  ${danger
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-orange-500 hover:bg-orange-600"}
                  disabled:opacity-60
                `}
              >
                {loading ? "Processing..." : confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
