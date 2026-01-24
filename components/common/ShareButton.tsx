"use client";

import { FiShare2 } from "react-icons/fi";

export function ShareButton({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-black"
    >
      <FiShare2 /> Share
    </button>
  );
}
