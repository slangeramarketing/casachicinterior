"use client";

/***************************************************
 * File: components/public/location-page/LocationPage.tsx
 * Purpose: Presentational layout for an area landing page.
 * Client component (still server-rendered to HTML) because the shared
 * OptimizedImage attaches an onError handler, which cannot cross the
 * server/client boundary from a server component. Metadata and JSON-LD
 * are produced by the server page that renders this.
 ***************************************************/

import Link from "next/link";
import { FiArrowRight, FiCheck, FiMapPin, FiStar } from "react-icons/fi";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import Breadcrumbs, { BreadcrumbLink } from "@/components/public/seo/Breadcrumbs";
import ContactSection from "@/components/public/landing-page/ContactSection";
import LocationFaqAccordion from "./LocationFaqAccordion";
import { LocationResponseDTO } from "@/modules/locations/location.dto";
import { ServiceResponseDTO } from "@/modules/services/service.dto";

const FALLBACK_HERO = "/assets/hero-wallpaper.webp";

interface LocationPageProps {
  location: LocationResponseDTO;
  services: ServiceResponseDTO[];
  breadcrumbs: BreadcrumbLink[];
}

function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function LocationPage({ location, services, breadcrumbs }: LocationPageProps) {
  const intro = paragraphs(location.intro);
  const { areaName } = location;

  return (
    <div className="bg-white">
      {/* 1. HERO */}
      <section className="relative h-[60vh] min-h-[420px] w-full flex items-center justify-center overflow-hidden">
        <OptimizedImage
          src={location.heroImage || FALLBACK_HERO}
          alt={`Interior design work by Casa Chic Interior in ${areaName}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#090F1A]/60" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <Breadcrumbs items={breadcrumbs} tone="light" align="center" className="mb-4" />
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F97316] text-xs font-bold tracking-widest uppercase">
            <FiMapPin aria-hidden="true" /> {areaName}
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-tight">{location.title}</h1>
          {intro[0] && <p className="mt-5 text-base md:text-lg text-white/90 max-w-3xl mx-auto">{intro[0]}</p>}
          <Link
            href={location.ctaLink}
            className="inline-flex items-center gap-3 mt-8 bg-[#F97316] text-white px-8 py-4 rounded-full font-bold hover:shadow-[0_10px_40px_-10px_#F97316] transition-all"
          >
            {location.ctaText} <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        {/* 2. INTRO + LOCALITIES */}
        <section className="py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-5 text-gray-600 leading-relaxed text-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-[#090F1A]">Interior design in {areaName}</h2>
            {intro.slice(1).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {intro.length <= 1 && intro[0] && <p>{intro[0]}</p>}
          </div>

          {location.localities.length > 0 && (
            <aside className="bg-[#F8F8F8] rounded-2xl p-8 h-fit">
              <h2 className="text-xl font-bold text-[#090F1A] mb-4">Areas in {areaName} we serve</h2>
              <ul className="flex flex-wrap gap-2">
                {location.localities.map((l) => (
                  <li key={l} className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700">
                    {l}
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </section>

        {/* 3. SERVICES */}
        {services.length > 0 && (
          <section className="pb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[#090F1A] mb-10">Our services in {areaName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <Link
                  key={s.id}
                  href={`/services/detail/${s.slug}`}
                  className="group rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <OptimizedImage src={s.coverImage} alt={s.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#090F1A] group-hover:text-[#F97316] transition-colors">{s.title}</h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{s.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 4. PROJECTS */}
        {location.projects.length > 0 && (
          <section className="pb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[#090F1A] mb-2">Recent projects in {areaName}</h2>
            <p className="text-gray-600 mb-10">Homes and workspaces we have completed in the area.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {location.projects.map((p, i) => (
                <article key={`${p.title}-${i}`} className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                  {p.image && (
                    <div className="relative h-64">
                      <OptimizedImage src={p.image} alt={`${p.title}${p.locality ? `, ${p.locality}` : ""}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#090F1A]">{p.title}</h3>
                    <p className="text-sm text-[#F97316] font-semibold mt-1">
                      {[p.locality, p.flatSize, p.scope].filter(Boolean).join(" · ")}
                    </p>
                    {p.description && <p className="text-gray-600 mt-3 leading-relaxed">{p.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 5. BUDGET GUIDE */}
        {location.budgets.length > 0 && (
          <section className="pb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[#090F1A] mb-2">Typical budgets in {areaName}</h2>
            <p className="text-gray-600 mb-8">Indicative ranges from recent projects. Your quote depends on size, materials and scope.</p>
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-left">
                <thead className="bg-[#F8F8F8] text-sm uppercase tracking-wide text-gray-600">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">Scope</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Typical range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {location.budgets.map((b, i) => (
                    <tr key={`${b.label}-${i}`}>
                      <td className="px-6 py-4 text-gray-700">{b.label}</td>
                      <td className="px-6 py-4 font-semibold text-[#090F1A]">{b.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 6. TESTIMONIALS */}
        {location.testimonials.length > 0 && (
          <section className="pb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[#090F1A] mb-10">What clients in {areaName} say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {location.testimonials.map((t, i) => (
                <blockquote key={`${t.name}-${i}`} className="rounded-2xl bg-[#F8F8F8] p-6 flex flex-col">
                  <div className="flex items-center gap-1 text-[#F97316]" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <FiStar key={s} aria-hidden="true" className="fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-gray-700 leading-relaxed flex-1">“{t.text}”</p>
                  <footer className="mt-4 text-sm font-semibold text-[#090F1A]">
                    {t.name}
                    {t.locality && <span className="font-normal text-gray-500"> · {t.locality}</span>}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {/* 7. FAQ */}
        {location.faqs.length > 0 && (
          <section className="pb-20 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#090F1A]">Questions from {areaName} homeowners</h2>
              <p className="text-gray-600 mt-2">Answers to what clients in the area ask us most.</p>
            </div>
            <LocationFaqAccordion faqs={location.faqs} />
          </section>
        )}

        {/* 8. WHY US (short, consistent across areas) */}
        <section className="pb-20">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            {["Free consultation and site measurement", "One team for design, civil work and installation", "Written timeline and transparent quote"].map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                <FiCheck aria-hidden="true" className="mt-0.5 text-[#F97316] shrink-0" /> {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 9. CONTACT */}
      <ContactSection headingAs="h2" heading={`Plan your ${areaName} project with us`} />
    </div>
  );
}
