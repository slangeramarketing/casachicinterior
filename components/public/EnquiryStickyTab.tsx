"use client";

interface EnquiryStickyTabProps {
  onClick?: () => void;
}

export default function EnquiryStickyTab({ onClick }: EnquiryStickyTabProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Open enquiry form"
      className="
        fixed
        right-3
        top-1/2
        -translate-y-1/2
        rotate-[-90deg]
        origin-right

        bg-bg-primary
        text-white

        px-4
        py-2
        text-xs
        font-semibold
        tracking-widest
        uppercase

        rounded-t-md
        shadow-lg

        z-[9999]

        transition-all
        duration-300
        hover:opacity-90
        opacity-80
      "
    >
      Enquire Now
    </button>
  );
}
