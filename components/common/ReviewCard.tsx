"use client";

import { useState } from "react";
import Image from "next/image";
import md5 from "md5";
import { OptimizedImage } from "./OptimizedImage";

/* =========================
   TYPES
========================= */
export interface Review {
  id: string;
  clientName: string;
  clientEmail: string;
  location?: string;

  rating: number; // 1–5
  message: string;

  projectCategory: string;
  reviewedAt: string;
}

/* =========================
   HELPERS
========================= */
function getGravatar(email: string) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
}

/* =========================
   COMPONENT
========================= */
export default function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);

  const isLongText = review.message.length > 160;
  const displayText = expanded
    ? review.message
    : review.message.slice(0, 160);

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 transition-all duration-300 w-95">

      {/* MESSAGE */}
      <p className="text-gray-700 leading-relaxed">
        <span className="text-orange-500 text-xl font-bold mr-1">“</span>
        {displayText}
        {isLongText && !expanded && "... "}
        <span className="text-orange-500 text-xl font-bold ml-1">”</span>

        {isLongText && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-orange-500 font-medium hover:underline"
          >
            {expanded ? "read less" : "read more"}
          </button>
        )}
      </p>

      {/* USER + RATING */}
      <div className="flex items-center gap-4 mt-6">
        <OptimizedImage
          src={getGravatar(review.clientEmail)}
          alt={review.clientName}
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex-1">
          {/* STARS */}
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-2xl ${
                  i < review.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* NAME */}
          <p className="font-semibold text-gray-800">
            {review.clientName}
            {review.location && (
              <span className="text-gray-500 font-normal">
                {" "}
                ({review.location})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t mt-6 pt-3 flex flex-col text-sm text-gray-500">
        <span className="text-xs">
          <strong className="text-gray-600">Project:</strong>{" "}
          {review.projectCategory}
        </span>
        <span className="text-xs">
          <strong className="text-gray-600">Reviewed at:</strong>{" "}
          {review.reviewedAt}
        </span>
      </div>
    </div>
  );
}
