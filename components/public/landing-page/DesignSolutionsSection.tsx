"use client";

import { useRef } from "react";
import { ServiceResponseDTO } from "@/modules/services/service.dto";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { useRouter } from "next/navigation";

interface HeaderProps {
  featuredServiceList:ServiceResponseDTO[];
}
export default function DesignSolutionsSection({featuredServiceList}:HeaderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const router=useRouter();

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full py-20 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Design <span className="text-orange-500">Solutions</span>
            </h2>
            <p className="mt-3 max-w-xl text-gray-600 text-sm md:text-base">
              We design modern living rooms, elegant bedrooms, stylish kitchens,
              and complete home interiors that reflect your lifestyle and personality.
            </p>
            <div className="mt-4 h-[2px] w-32 bg-black" />
          </div>

          {/* ARROWS (Desktop Only) */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl"
            >
              ‹
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl"
            >
              ›
            </button>
          </div>
        </div>

        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
        >
          {featuredServiceList.map((item) => (
            <div
              key={item.id}
              className="w-[350px]  lg:w-[300px] bg-orange-500 rounded-xl overflow-hidden text-white flex-shrink-0 hover:shadow-lg transition"
              onClick={()=>router.push(`services/detail/${item.slug}`)}
            >
              <div className="relative w-full h-48">
                <OptimizedImage
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="py-5 px-4">
                <h3 className="font-semibold text-lg leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-100">
                  {item.shortDescription}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
