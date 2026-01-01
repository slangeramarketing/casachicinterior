import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { servicesData } from "@/lib/data/services/service.data";
import * as FiIcons from "react-icons/fi";

export function generateStaticParams() {
  return servicesData.map((project) => ({
    slug: project.slug,
  }));
}

/* -------------------------------------
   PAGE
------------------------------------- */
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {slug}= await params
  const service = servicesData.find(
    (item) => item.slug === slug
  );

  if (!service) return notFound();

  return (
    <div className="w-full mt-8">

      {/* ================= HERO ================= */}
      <section className="relative w-full h-[65vh] flex items-center">
        <Image
          src={service.coverImage}
          alt={service.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-white">
          <p className="text-sm text-gray-300 mb-3">
            <Link href="/services" className="hover:underline">
              Services
            </Link>{" "}
            / {service.title}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            {service.title}
          </h1>

          <p className="mt-4 max-w-2xl text-gray-200">
            {service.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 bg-orange-500 rounded-md font-semibold hover:bg-orange-600"
            >
              Get Free Consultation
            </Link>
            <Link
              href="/projects"
              className="px-8 py-3 border border-white rounded-md hover:bg-white hover:text-gray-900"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* ================= OVERVIEW ================= */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Service Overview
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          {service.overview}
        </p>
      </section>

      {/* ================= INCLUDES ================= */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            What’s Included
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.includes.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative h-44">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h4 className="font-semibold text-gray-900">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h3 className="text-3xl font-bold text-gray-900 mb-12">
          Our Process
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {service.processSteps.map((step) => {
            const Icon =
              (FiIcons as any)[step.icon] || FiIcons.FiCheckCircle;

            return (
              <div
                key={step.step}
                className="flex gap-5 items-start"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500 text-white">
                  <Icon size={22} />
                </div>

                <div>
                  <h4 className="font-semibold text-lg text-gray-900">
                    {step.title}
                  </h4>
                  <p className="mt-1 text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gray-900 py-20 text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-white">
          Ready to Start Your Project?
        </h3>
        <p className="mt-4 text-gray-300">
          Let’s create a space that matches your vision.
        </p>

        <Link
          href="/contact"
          className="inline-block mt-8 px-8 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600"
        >
          Book Free Consultation
        </Link>
      </section>
    </div>
  );
}
