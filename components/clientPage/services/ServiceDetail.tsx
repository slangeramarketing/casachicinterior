import Image from "next/image";
import Link from "next/link";
import { PageRouteHeader } from "@/components/common/PageHeader";
import { FiEdit2 } from "react-icons/fi";

interface ServiceDetailProps {
  service: {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    description: string;
    coverImage: string;
    gallery: string[];
    highlights: string[];
    featured?: boolean;
    status?: "draft" | "published";
    ctaText?: string;
    ctaLink?: string;
  };
  isAdmin?: boolean;
}

export default function ServiceDetail({
  service,
  isAdmin = false,
}: ServiceDetailProps) {
  return (
    <div className="w-full">
      {/* ================= HEADER (ADMIN ONLY) ================= */}
      {isAdmin && (
        <div className="max-w-6xl mx-auto px-6 pt-6 flex justify-between">
          <PageRouteHeader />
          <Link
            href={`/admin/service/${service.id}`}
            className="flex items-center gap-2 text-sm text-blue-600"
          >
            <FiEdit2 /> Edit Service
          </Link>
        </div>
      )}

      {/* ================= HERO ================= */}
      <section className="relative w-full h-[70vh] flex items-center pt-12">
        <Image
          src={service.coverImage}
          alt={service.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col justify-center items-center">
            <PageRouteHeader/>
          <h1 className="text-4xl md:text-6xl font-bold text-white tex-center">
            {service.title}
          </h1>

          <p className="mt-4 max-w-2xl text-gray-200 text-lg text-center">
            {service.shortDescription}
          </p>

          {service.ctaText && service.ctaLink && (
            <Link
              href={service.ctaLink}
              className="inline-block mt-8 px-8 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600"
            >
              {service.ctaText}
            </Link>
          )}
        </div>
      </section>

      {/* ================= OVERVIEW ================= */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Service Overview
        </h2>
        <p className="text-gray-600 leading-relaxed lg:w-[70%]">
          {service.description}
        </p>
      </section>

      {/* ================= HIGHLIGHTS ================= */}
      {service.highlights.length > 0 && (
        <section className="bg-gray-50 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-3xl font-bold mb-12">
              What This Service Includes
            </h3>

            <div className="grid sm:grid-cols-2 gap-6">
              {service.highlights.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-lg border border-gray-300"
                >
                  <span className="text-orange-500">✔</span> &nbsp;{item}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ================= PROCESS (STATIC) ================= */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h3 className="text-3xl font-bold mb-12">
          Our Design & Execution Process
        </h3>

        {[
          "Consultation & requirement analysis",
          "Concept design & layout planning",
          "3D visualization & material finalization",
          "Execution & supervision",
          "Final handover & quality check",
        ].map((step, i) => (
          <div key={i} className="flex gap-6 mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white">
              {i + 1}
            </div>
            <p className="text-lg">{step}</p>
          </div>
        ))}
      </section>

      {/* ================= FINAL CTA ================= */}
      {service.ctaText && service.ctaLink && (
        <section className="bg-gray-900 py-20 text-center">
          <h3 className="text-4xl text-white font-bold">
            Ready to Transform Your Home?
          </h3>
          <p className="text-gray-400 py-4">Let’s design a space that reflects your lifestyle and comfort.</p>
          <Link
            href={service.ctaLink}
            className="inline-block mt-2 px-8 py-3 bg-orange-500 text-white rounded"
          >
            {service.ctaText}
          </Link>
        </section>
      )}
    </div>
  );
}
