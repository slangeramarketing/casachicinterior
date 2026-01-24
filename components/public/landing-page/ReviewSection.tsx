"use client";

import reviewsData from "@/lib/data/reviews/reviews.json";
import { Review } from "@/lib/data/review";
import { FaStar } from "react-icons/fa";
import { getGravatarUrl } from "@/lib/utils/gravatar";
import { OptimizedImage } from "@/components/common/OptimizedImage";

export default function ReviewSection() {
  const reviews = (reviewsData as Review[]).filter(
    (review) => review.status === "approved"
  );

  return (
    <section className="w-full py-24 bg-[#f6f6f6]">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Client <span className="text-orange-500">Review</span>
          </h2>

          <button className="self-start md:self-auto text-sm font-semibold border border-gray-300 px-5 py-2 rounded-full hover:bg-gray-900 hover:text-white transition">
            View More
          </button>
        </div>

        {/* REVIEWS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {/* MESSAGE */}
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="text-orange-500 text-lg font-bold">“</span>
                {review.message}
                <span className="text-orange-500 text-lg font-bold">”</span>
              </p>

              {/* FOOTER */}
              <div className="mt-6 flex items-center gap-4">
                {/* AVATAR (Gravatar via MD5) */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <OptimizedImage
                    src={getGravatarUrl(review.clientEmail, 96)}
                    alt={review.clientName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {review.clientName}
                    <span className="font-normal text-gray-500">
                      {" "}
                      ({review.location})
                    </span>
                  </p>

                  {/* RATING */}
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <FaStar
                        key={i}
                        className="text-orange-400 text-sm"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
