"use client";

import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { getGravatarUrl } from "@/lib/utils/gravatar";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { ReviewResponseDTO } from "@/modules/review/review.dto";
import { MdLocationOff } from "react-icons/md";

interface ReviewSectionProps {
  reviews: ReviewResponseDTO[];
}

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="w-full py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Client <span className="text-orange-500">Testimonials</span>
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Real feedback from homeowners we’ve worked with
            </p>
          </div>

          <button className="self-start md:self-auto text-sm font-semibold border border-gray-300 px-5 py-2 rounded-full hover:bg-gray-900 hover:text-white transition">
            View All Reviews
          </button>
        </div>

        {/* REVIEWS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between relative overflow-hidden"
            >
              {/* QUOTE ICON */}
              <FaQuoteLeft className="absolute top-6 right-6 text-orange-100 text-5xl" />

              {/* MESSAGE */}
              <p className="text-sm text-gray-700 leading-relaxed relative z-10">
                {review.message}
              </p>

              {/* FOOTER */}
              <div className="mt-8 flex items-center gap-4">
                {/* AVATAR */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={
                      review.clientAvatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        review.clientName
                      )}&background=F97316&color=ffffff&bold=true`
                    }
                    alt={review.clientName}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm flex flex-col">
                    {review.clientName}
                    {review.clientLocation && (
                      <span className="font-normal text-gray-500 text-[9px]">
                        {" "}({review.clientLocation})
                      </span>
                    )}
                  </p>

                  {/* STARS */}
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: review.rating ?? 0 }).map((_, i) => (
                      <FaStar key={i} className="text-orange-400 text-lg" />
                    ))}
                    
                  </div>
                  
                </div>
              </div>

              {/* HOVER GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-100/40 opacity-0 group-hover:opacity-100 transition" /> 
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
