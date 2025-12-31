import Image from "next/image";
import Link from "next/link";

/* -------------------------------------
   TYPES
------------------------------------- */
type Service = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
};

/* -------------------------------------
   SERVICES DATA (Unsplash Images)
------------------------------------- */
const services: Service[] = [
  {
    id: 1,
    title: "Residential Interior Design",
    slug: "residential-interior-design",
    description:
      "Modern, functional, and personalized home interiors designed around your lifestyle.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    id: 2,
    title: "Commercial Interior Design",
    slug: "commercial-interior-design",
    description:
      "Office and commercial spaces that enhance productivity and brand identity.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c",
  },
  {
    id: 3,
    title: "Turnkey Interior Solutions",
    slug: "turnkey-interior-solutions",
    description:
      "End-to-end interior execution from concept to final handover.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
  },
  {
    id: 4,
    title: "Custom Furniture & Woodwork",
    slug: "custom-furniture-woodwork",
    description:
      "Made-to-measure furniture crafted for durability and aesthetics.",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
  },
  {
    id: 5,
    title: "Design Consultancy",
    slug: "design-consultancy",
    description:
      "Professional design guidance, layouts, and material planning.",
    image:
      "https://images.unsplash.com/photo-1594125674965-70d796b6693f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

/* -------------------------------------
   PAGE
------------------------------------- */
export default function ServicesPage() {
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
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Interior Services
          </h2>
          <p className="mt-4 text-gray-600">
            We offer complete interior design and execution services tailored
            to your needs, style, and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-xl transition"
            >
              <div className="relative h-[220px]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                <Link
                  href={`/services/${service.slug}`}
                  className="inline-block mt-5 text-orange-500 font-semibold text-sm hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
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
