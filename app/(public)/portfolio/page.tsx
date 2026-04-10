/**
 * File: app/(public)/portfolio/page.tsx
 * Layer: Page (Server Component)
 *
 * Purpose:
 * - Fetches portfolio data via the Server Facade.
 * - Passes DTOs to Client Components (Hero, Grid, PDF Generator).
 * - Renders Portfolio Footer with "Thank You" section.
 */

import { getPortfolioProjects, getFeaturedPortfolioProjects } from "@/modules/services/portfolio/portfolio.server";
import PortfolioHero from "@/components/public/services/PortfolioHero";
import PortfolioGrid from "@/components/public/services/PortfolioGrid";
import PortfolioGenerator from "@/components/public/services/PortfolioGenerator";
import PortfolioFooter from "@/components/public/services/PortfolioFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | CasaChic Interior Design — Delhi NCR",
  description:
    "Explore CasaChic's home renovation portfolio. See real before & after transformations with fixed pricing, premium brands, and guaranteed timelines.",
  keywords: ["interior design portfolio", "home renovation Delhi NCR", "modular kitchen", "bedroom design"],
};

export default async function PortfolioPage() {
  const [allProjects, featuredProjects] = await Promise.all([
    getPortfolioProjects(),
    getFeaturedPortfolioProjects(),
  ]);

  // Use first featured project for hero, fallback to first project
  const heroProject = featuredProjects[0] ?? allProjects[0];

  return (
    <main className="relative">
      {/* Section 1: Hero — Orange BG, Before/After Slider, SVG Patterns */}
      {heroProject && <PortfolioHero featuredProject={heroProject} />}

      {/* Section 2: PDF Download CTA Banner — FIXED MOBILE VIEW */}
      <section className="bg-gray-50/50 py-8 px-4 md:py-12 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-orange-100/50 border border-orange-50 flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Background Decorative Element for Mobile */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-60" />

            <div className="relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-100/50 text-[#F97316] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]"></span>
                </span>
                Digital Brochure
              </div>

              {/* FIXED HEADING: Using text-balance and careful font sizing */}
              <h2 className="text-[12px] xs:text-2xl md:text-3xl font-black text-[#090F1A] leading-[1.2] mb-3 text-balance">
                Download Our <span className="text-[#F97316] inline-block whitespace-nowrap">Business Portfolio</span>
              </h2>

              <p className="text-gray-500 text-sm md:text-base max-w-md leading-relaxed">
                A professionally designed brochure with all our projects, costs, and material brands — <span className="font-bold text-[#090F1A]">share it with family too!</span>
              </p>
            </div>

            {/* Button Wrapper */}
            <div className="relative z-10 w-full md:w-auto">
              <PortfolioGenerator projects={allProjects} />
              <p className="text-center text-[10px] text-gray-400 mt-3 font-medium md:hidden">
                PDF format • Optimized for WhatsApp sharing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Full Portfolio Grid */}
      <PortfolioGrid projects={allProjects} />

      {/* Section 4: Footer — "Thank You So Much" with orange background */}
      <PortfolioFooter />
    </main>
  );
}
