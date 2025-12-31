import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

/* -------------------------------------
   TYPES
------------------------------------- */
type Service = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  overview: string;
  coverImage: string;
  includes: string[];
  process: string[];
};

/* -------------------------------------
   SERVICE DATA (STATIC for now)
------------------------------------- */
const services: Service[] = [
  {
    id: 1,
    title: "Residential Interior Design",
    slug: "residential-interior-design",
    shortDescription:
      "Modern, functional, and personalized home interiors designed around your lifestyle.",
    overview:
      "At CasaChic Interior, we specialize in designing residential spaces that balance aesthetics, comfort, and functionality. From compact apartments to luxury villas, our designs are tailored to your daily needs, lifestyle, and long-term comfort.",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    includes: [
      "Space planning & layout design",
      "Modular kitchen & wardrobes",
      "False ceiling & lighting design",
      "Custom furniture & storage solutions",
      "Material selection & finishes",
      "On-site execution & supervision",
    ],
    process: [
      "Consultation & requirement analysis",
      "Concept design & layout planning",
      "3D visualization & material finalization",
      "Execution & site supervision",
      "Final handover & quality check",
    ],
  },
];

/* -------------------------------------
   PAGE
------------------------------------- */
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

    const {slug}=await params;
  const service = services.find(
    (item) => item.slug ===slug
  );

console.log("Slug:",slug);
console.log("All slugs:", services.map(s => s.slug));


  if (!service) return notFound();

  return (
    <div className="w-full">

      {/* ================= HERO ================= */}
      <section className="relative w-full h-[70vh] flex items-center">
        <Image
          src={service.coverImage}
          alt={service.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <p className="text-sm text-gray-300 mb-2">
            <Link href="/services" className="hover:underline">
              Services
            </Link>{" "}
            / {service.title}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {service.title}
          </h1>

          <p className="mt-4 max-w-2xl text-gray-200 text-base md:text-lg">
            {service.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
            >
              Get Free Consultation
            </Link>
            <Link
              href="/projects"
              className="px-8 py-3 border border-white text-white font-semibold rounded-md hover:bg-white hover:text-gray-900 transition"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* ================= OVERVIEW ================= */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900">
            Designing Homes That Feel Like You
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed">
            {service.overview}
          </p>
        </div>
      </section>

      {/* ================= WHAT'S INCLUDED ================= */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            What This Service Includes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {service.includes.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white p-5 rounded-lg border border-gray-200"
              >
                <span className="text-orange-500 font-bold">✔</span>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h3 className="text-3xl font-bold text-gray-900 mb-12">
          Our Design & Execution Process
        </h3>

        <div className="space-y-6">
          {service.process.map((step, index) => (
            <div
              key={index}
              className="flex gap-6 items-start"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                {index + 1}
              </div>
              <p className="text-gray-700 text-lg">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Transform Your Home?
          </h3>
          <p className="mt-4 text-gray-300">
            Let’s design a space that reflects your lifestyle and comfort.
          </p>

          <Link
            href="/contact"
            className="inline-block mt-8 px-8 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
          >
            Book Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
