import ServiceList from "@/components/clientPage/services/ServiceList";
import { PageRouteHeader } from "@/components/common/PageHeader";
import { serviceServer } from "@/modules/services/service.server";
import Image from "next/image";
import Link from "next/link";



/* -------------------------------------
   PAGE
------------------------------------- */
export default async function ServicesPage() {
  /* -----------------------------
       Fetch services (DB)
    ----------------------------- */
    const services = await serviceServer.getAll();
  return (
    <div className="w-full mt-8">

      {/* ================= HERO ================= */}
      <section className="relative w-full h-[70vh] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8MHx8fDA%3D"
          alt="Interior Design Services"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center max-w-3xl px-6">
          <div className="w-full flex justify-center">
            <PageRouteHeader />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Interior Design Services for Modern Spaces
          </h1>
          <p className="mt-4 text-gray-200 text-base md:text-lg">
            Thoughtfully crafted interior solutions for homes, offices, and
            commercial spaces — from concept to execution.
          </p>

          <Link
            href="#services"
            className="inline-block mt-8 px-8 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
          >
            Explore Services
          </Link>
        </div>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section
        id="services"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <ServiceList services={services} />
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Transform Your Space?
          </h3>
          <p className="mt-4 text-gray-300">
            Get expert interior design consultation tailored to your space and
            budget.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
            >
              Get Free Consultation
            </Link>

            <Link
              href="/projects"
              className="px-8 py-3 border border-gray-500 text-white font-semibold rounded-md hover:bg-white hover:text-gray-900 transition"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
