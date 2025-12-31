"use client";

import Link from "next/link";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F97316]/10 text-[#F97316]">
            <FiAlertTriangle size={40} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          404
        </h1>

        {/* Subtitle */}
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Page not found
        </h2>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          The page you are looking for doesn’t exist or was moved.
        </p>

        {/* Action */}
        <Link
          href="/"
          className="
            inline-flex items-center gap-2 px-5 py-2.5
            rounded-md bg-[#F97316] text-white
            hover:bg-[#ea6a10] transition
          "
        >
          <FiArrowLeft />
          Back to Home
        </Link>

      </div>
    </div>
  );
}
