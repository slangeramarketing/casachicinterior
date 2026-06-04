"use client";

import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { ReviewResponseDTO } from "@/modules/review/review.dto";

interface ReviewSectionProps {
  reviews: ReviewResponseDTO[];
  theme?: "light" | "dark";
}

export default function ReviewSection({ reviews, theme = "light" }: ReviewSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  const isDark = theme === "dark";

  return (
    <section className={`w-full py-24 ${isDark ? 'bg-[#050505] relative z-50' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
          <div>
            <h2 className={`text-3xl md:text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Client <span className="text-orange-500">Testimonials</span>
            </h2>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Real feedback from homeowners we’ve worked with
            </p>
          </div>

          <button className={`self-start md:self-auto text-sm font-semibold border px-5 py-2 rounded-full transition ${isDark ? 'border-zinc-700 text-gray-300 hover:bg-white hover:text-black' : 'border-gray-300 text-gray-900 hover:bg-gray-900 hover:text-white'}`}>
            View All Reviews
          </button>
        </div>

        {/* REVIEWS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`group rounded-3xl p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between relative overflow-hidden ${isDark ? 'bg-zinc-900 shadow-orange-500/5 hover:shadow-orange-500/10 border border-white/5' : 'bg-white'}`}
            >
              {/* QUOTE ICON */}
              <FaQuoteLeft className={`absolute top-6 right-6 text-5xl ${isDark ? 'text-orange-500/10' : 'text-orange-100'}`} />

              {/* MESSAGE */}
              <p className={`text-sm leading-relaxed relative z-10 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {review.message}
              </p>

              {/* FOOTER */}
              <div className="mt-8 flex items-center gap-4">
                {/* AVATAR */}
                <div className={`relative w-12 h-12 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                  <img
                    src={
                      review.clientAvatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        review.clientName
                      )}&background=F97316&color=ffffff&bold=true`
                    }
                    alt={review.clientName}
                    className={`w-12 h-12 rounded-full border-2 shadow-sm object-cover ${isDark ? 'border-zinc-700' : 'border-white'}`}
                  />
                </div>

                <div className="flex-1">
                  <p className={`font-semibold text-sm flex flex-col ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {review.clientName}
                    {review.clientLocation && (
                      <span className={`font-normal text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
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
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition ${isDark ? 'bg-gradient-to-br from-orange-500/0 to-orange-500/10' : 'bg-gradient-to-br from-orange-50/0 to-orange-100/40'}`} /> 
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
