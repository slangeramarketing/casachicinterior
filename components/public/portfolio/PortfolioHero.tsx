"use client";

/***************************************************
 * File: components/public/services/PortfolioHero.tsx
 * Updated to strictly match the reference design:
 * - Orange (#F97316) solid background
 * - Top-left geometric logo pattern
 * - Navy semicircle top-right overlapping slider
 * - White sofa line-art + concentric circles (SVG)
 * - Presented By badge
 * - Before/After slider with dark border
 ***************************************************/

import { motion } from "framer-motion";
import HeroBeforeAfterSlider from "./HeroBeforeAfterSlider";
import { PortfolioItemDTO } from "@/modules/portfolio/portfolio.dto";

interface PortfolioHeroProps {
  featuredProject: PortfolioItemDTO;
}

// ── Inline SVG: Geometric Logo Pattern (top-left) ──
const GeometricPattern = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="38" height="38" fill="#090F1A" />
    <rect x="42" y="0" width="38" height="38" fill="#090F1A" />
    <polygon points="0,42 38,42 0,80" fill="#090F1A" />
    <polygon points="80,42 42,42 80,80" fill="#090F1A" />
    <rect x="42" y="42" width="38" height="38" fill="#090F1A" />
  </svg>
);

// ── Inline SVG: Concentric Arcs (bottom-left) ──
const ConcentricArcs = () => (
  <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[20, 35, 50, 65, 80].map((r, i) => (
      <path
        key={i}
        d={`M 0 ${r} Q ${r / 2} 0 ${r} 0`}
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity={0.7}
      />
    ))}
  </svg>
);

// ── Inline SVG: Sofa Line Art ──
const SofaIcon = () => (
  <svg width="150" height="100" viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Base */}
    <rect x="10" y="35" width="70" height="18" rx="4" />
    {/* Back */}
    <rect x="14" y="20" width="62" height="18" rx="4" />
    {/* Left Arm */}
    <rect x="6" y="28" width="10" height="25" rx="3" />
    {/* Right Arm */}
    <rect x="74" y="28" width="10" height="25" rx="3" />
    {/* Left Leg */}
    <line x1="16" y1="53" x2="16" y2="60" />
    {/* Right Leg */}
    <line x1="74" y1="53" x2="74" y2="60" />
    {/* Seat division */}
    <line x1="45" y1="35" x2="45" y2="53" />
    {/* Cushion curves */}
    <path d="M14 28 Q22 22 30 28" />
    <path d="M60 28 Q68 22 76 28" />
  </svg>
);

// ── Inline SVG: Navy Semicircle (top-right of slider) ──
const NavySemicircle = () => (
  <svg width="130" height="100" viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M130 0 A65 100 0 0 0 0 0 Z" fill="#090F1A" />
  </svg>
);

export default function PortfolioHero({ featuredProject }: PortfolioHeroProps) {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden py-8" style={{ backgroundColor: "#F97316" }}>

      {/* ── Top-Left: Geometric Logo Pattern ── */}
      <div className="absolute top-0 left-0 z-10">
        <GeometricPattern />
      </div>

      {/* ── Top-Right: Navy Semicircle overlapping slider ── */}
      <div className="absolute top-0 right-0 z-20 pointer-events-none">
        <NavySemicircle />
      </div>

      {/* ── Bottom-Left: Concentric Arcs ── */}
      <div className="absolute bottom-6 left-6 z-10 opacity-80">
        <ConcentricArcs />
      </div>

      {/* ── Bottom-Left (mid): Sofa Icon ── */}
      <div className="absolute bottom-8 left-44 z-10 opacity-85">
        <SofaIcon />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="max-w-7xl mx-auto px-5 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-20 relative z-10">

        {/* LEFT: Copy */}
        <div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5 break-words"
          >
            <span className="text-white">Transformation</span>
            <br />
            <span style={{ color: "#090F1A" }}>Beyond</span>
            <br />
            <span className="text-white">Imagination</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-white/90 text-base md:text-lg leading-relaxed mb-8 max-w-md"
          >
            We don&apos;t just renovate spaces — we craft experiences. Fixed pricing,
            premium brands (Asian Paints, Hettich, CenturyPly), and a timeline we actually keep.
          </motion.p>

          {/* Presented By Badge */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <span
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold"
              style={{ backgroundColor: "#090F1A" }}
            >
              Presented By:{" "}
              <strong className="font-extrabold">CasaChic Design Team</strong>
            </span>
          </motion.div> */}
        </div>

        {/* RIGHT: Before/After Slider */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="relative w-full"
        >
          {/* Slider Box with dark border and forced aspect-ratio */}
          <div
            className="w-full rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[16/10] bg-white/5"
            style={{
              border: "4px solid #090F1A",
            }}
          >
            <HeroBeforeAfterSlider
              beforeImg={featuredProject.beforeImg}
              afterImg={featuredProject.afterImg}
              title={featuredProject.title}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
