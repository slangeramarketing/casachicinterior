"use client";

import { OptimizedImage } from "@/components/common/OptimizedImage";
import { ServiceResponseDTO } from "@/modules/services/service.dto";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function PublicServicesList({ services }: { services: ServiceResponseDTO[] }) {
  return (
    <div className="w-full bg-[#F2F2F2]">
      {/* HERO SECTION */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000"
          alt="Interior Design"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#090F1A]/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our Interior Services
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Professional interior design and execution services tailored to your needs.
            From concept to reality, we handle everything.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12 border-l-4 border-[#F97316] pl-4">
          <h2 className="text-3xl font-bold text-[#090F1A]">Professional Solutions</h2>
          <p className="text-gray-600 mt-2">Explore our range of specialized interior services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-60 w-full">
                <OptimizedImage
                  src={service.coverImage || "/placeholder-service.jpg"}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#F97316] text-white px-3 py-1 text-xs font-bold rounded-full">
                    {service.category?.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#090F1A] mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {service.shortDescription}
                </p>
                
                <Link 
                  href={`/services/detail/${service.slug}`}
                  className="flex items-center justify-between group-hover:text-[#F97316] transition-colors"
                >
                  <span className="text-sm font-bold">LEARN MORE</span>
                  <FiArrowRight className="group-hover:translate-x-2 transition-all" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#090F1A] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h3>
          <p className="text-gray-400 mb-10">
            Get a free consultation and estimate for your space from our expert designers.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-[#F97316] text-white font-bold rounded-lg hover:bg-orange-600 transition-all"
          >
            GET FREE QUOTE
          </Link>
        </div>
      </section>
    </div>
  );
}