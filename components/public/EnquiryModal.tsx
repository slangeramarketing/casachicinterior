"use client";

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function EnquiryModal({
  open,
  onClose,
  children,
}: EnquiryModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="md:px-12 md:py-12 relative bg-white w-full max-w-6xl mx-4 max-h-[95vh] overflow-y-auto rounded-2xl shadow-xl">

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close Modal"
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
