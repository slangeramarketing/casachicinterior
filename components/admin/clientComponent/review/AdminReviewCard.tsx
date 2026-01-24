"use client";

/***************************************************
 * File: components/admin/clientComponent/review/AdminReviewCard.tsx
 * Layer: Client Component
 *
 * Purpose:
 * - Display a single review card for admin
 *
 * Responsibilities:
 * - Render review info
 * - Trigger moderation & delete actions
 *
 * Restrictions:
 * - Must NOT fetch data
 ***************************************************/

import Link from "next/link";
import {
  FiMapPin,
  FiStar,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { ReviewResponseDTO } from "@/modules/review/review.dto";
import { useState } from "react";
import {
  moderateReviewAction,
  deleteReviewAction,
} from "@/app/actions/review.action";
import { useRouter } from "next/navigation";
import ConfirmActionDialog from "../../ConfirmActionDialogProps";
import { RiDeleteBin6Line } from "react-icons/ri";

interface AdminReviewCardProps {
  review: ReviewResponseDTO;
}

export default function AdminReviewCard({ review }: AdminReviewCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const statusColors = {
    approved: "bg-green-50 text-green-600 border-green-100",
    pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
    rejected: "bg-red-50 text-red-600 border-red-100",
  };

  /* ===============================================
     Actions
     =============================================== */

  const handleQuickAction = async (
    status: "approved" | "rejected"
  ) => {
    try {
      setLoading(true);
      await moderateReviewAction(review.id, { status });
      router.refresh(); // ✅ re-fetch server data
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteReviewAction(review.id);
      router.refresh(); // ✅ refresh list after delete
    } finally {
      setLoading(false);
    }
  };

  /* ===============================================
     Helpers
     =============================================== */

  const displayDate =
    review.submittedAt ?? review.createdAt;

  const formattedDate = new Date(displayDate).toLocaleDateString(
    "en-IN",
    { day: "2-digit", month: "short", year: "numeric" }
  );

  /* ===============================================
     UI
     =============================================== */

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative">

      {/* ACTION ICONS */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* EDIT */}
        <Link
          href={`/admin/review/update/${review.id}`}
          className="p-2 bg-gray-50 text-gray-400 hover:text-[#F97316] hover:bg-orange-50 rounded-full transition-all border border-transparent hover:border-orange-200 shadow-sm"
          title="Edit / Moderate Review"
        >
          <FiEdit size={16} />
        </Link>

        {/* DELETE */}
        {/* <button
          onClick={handleDelete}
          disabled={loading}
          className="p-2 bg-gray-50 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-200 shadow-sm disabled:opacity-50"
          title="Delete Review"
        >
          <FiTrash2 size={16} />
        </button> */}
         <ConfirmActionDialog
            title="Delete Review"
            description="This Review will be permanently delet, This action cannot be undone."
            confirmText="Delete"
            danger
            action={() => handleDelete()}
            trigger={
                <button
                title="Delete"
                className="p-1 rounded-md text-sm text-red-400 hover:bg-red-200 transition"
                >
                <RiDeleteBin6Line size={20} />
                </button>
            }
          />
      </div>

      {/* HEADER */}
      <div className="flex gap-3 mb-4 items-center">
        <img
          src={
            review.clientAvatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              review.clientName
            )}`
          }
          alt={review.clientName}
          className="w-12 h-12 rounded-full border-2 border-gray-100 object-cover"
        />

        <div className="pr-16">
          <h4 className="font-bold text-gray-800 leading-tight line-clamp-1">
            {review.clientName}
          </h4>

          {review.clientLocation && (
            <div className="flex items-center gap-1 text-gray-400 text-[11px] mt-1">
              <FiMapPin size={12} />
              <span>{review.clientLocation}</span>
            </div>
          )}
        </div>
      </div>

      {/* STATUS */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
          Service Review
        </span>

        <span
          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
            statusColors[review.status]
          }`}
        >
          {review.status}
        </span>
      </div>

      {/* RATING */}
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            size={14}
            className={
              i < (review.rating ?? 0)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200"
            }
          />
        ))}
      </div>

      {/* MESSAGE */}
      <p className="text-gray-600 text-sm italic line-clamp-3 mb-4 min-h-[60px] leading-relaxed">
        {review.message
          ? `"${review.message}"`
          : "Waiting for client to submit review…"}
      </p>

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
          <FiCalendar size={12} />
          <span>{formattedDate}</span>
        </div>

        {/* QUICK ACTIONS */}
        {review.status === "pending" && (
          <div className="flex gap-1">
            <button
              disabled={loading}
              onClick={() => handleQuickAction("approved")}
              className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
              title="Approve"
            >
              <FiCheckCircle size={18} />
            </button>

            <button
              disabled={loading}
              onClick={() => handleQuickAction("rejected")}
              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Reject"
            >
              <FiXCircle size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
