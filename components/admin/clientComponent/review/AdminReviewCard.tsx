"use client";

import Link from "next/link";
import { 
  FiMapPin, 
  FiStar, 
  FiCalendar, 
  FiCheckCircle, 
  FiXCircle, 
  FiEdit 
} from "react-icons/fi";

interface AdminReviewCardProps {
  review: any;
  onStatusChange: (id: string, status: "approved" | "rejected") => void;
}

export default function AdminReviewCard({ review, onStatusChange }: AdminReviewCardProps) {
  const statusColors = {
    approved: "bg-green-50 text-green-600 border-green-100",
    pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
    rejected: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group relative">
      
      {/* EDIT BUTTON: Ispe click karke edit form page pe jayenge */}
      <Link 
        href={`/admin/reviews/${review.id}`}
        className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:text-[#F97316] hover:bg-orange-50 rounded-full transition-all border border-transparent hover:border-orange-200 shadow-sm"
        title="Edit/Update Review"
      >
        <FiEdit size={16} />
      </Link>

      {/* Header: Avatar & Basic Info */}
      <div className="flex gap-3 mb-4">
        <img 
          src={review.avatar} 
          alt={review.name} 
          className="w-12 h-12 rounded-full border-2 border-gray-100 object-cover"
        />
        <div className="pr-8">
          <h4 className="font-bold text-gray-800 leading-tight line-clamp-1">{review.name}</h4>
          <div className="flex items-center gap-1 text-gray-400 text-[11px] mt-1">
            <FiMapPin size={12} />
            <span>{review.location}</span>
          </div>
        </div>
      </div>

      {/* Service Tag & Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
          {review.serviceName}
        </span>
        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${statusColors[review.status as keyof typeof statusColors]}`}>
          {review.status}
        </span>
      </div>

      {/* Rating Stars */}
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i} 
            size={14} 
            className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
          />
        ))}
      </div>

      {/* Review Message Snippet */}
      <p className="text-gray-600 text-sm italic line-clamp-3 mb-4 min-h-[60px] leading-relaxed">
        "{review.message || "Waiting for client to submit..."}"
      </p>

      {/* Footer: Date & Quick Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
          <FiCalendar size={12} />
          <span>{review.date}</span>
        </div>

        {/* Quick status actions only for pending ones */}
        {review.status === "pending" && (
          <div className="flex gap-1">
            <button 
              onClick={() => onStatusChange(review.id, "approved")}
              className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
              title="Quick Approve"
            >
              <FiCheckCircle size={18} />
            </button>
            <button 
              onClick={() => onStatusChange(review.id, "rejected")}
              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
              title="Quick Reject"
            >
              <FiXCircle size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}