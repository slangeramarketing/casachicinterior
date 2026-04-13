"use client";

/***************************************************
 * File: components/public/services/PortfolioFooter.tsx
 * matches reference Image 2 and Reference Image 1 Elements:
 * - Wide rounded premium interior image on top, now ENHANCED
 * - Image framed with dark geometric overlapping shapes (Ref 1 Style)
 * - Orange (#F97316) background base
 * - "Thank You So Much" large bold white text
 * - Three navy pill contact badges (#090F1A)
 * - Chair line-art SVG (left)
 * - Vertical arc/circle pattern (bottom-right)
 * - Grid pattern (top-left)
 ***************************************************/

import { motion } from "framer-motion";
import Image from "next/image";
import { FiGlobe, FiPhone, FiMapPin } from "react-icons/fi";

// ── Inline SVG: Chair Line Art (Same as before) ──
const ChairIcon = () => (
  <svg width="65" height="70" viewBox="0 0 75 80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="37.5" cy="40" rx="28" ry="6" />
    <line x1="16" y1="10" x2="14" y2="40" />
    <line x1="59" y1="10" x2="61" y2="40" />
    <path d="M16 10 Q37 2 59 10" />
    <line x1="22" y1="44" x2="18" y2="70" />
    <line x1="53" y1="44" x2="57" y2="70" />
    <line x1="18" y1="60" x2="57" y2="60" />
    <path d="M16 28 Q10 30 9 38" />
    <path d="M59 28 Q65 30 66 38" />
  </svg>
);

// ── Inline SVG: Square Grid Pattern (Ref 2 Style) ──
const GridPattern = () => (
  <svg width="70" height="70" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[0, 20, 40, 60].map((x) =>
      [0, 20, 40, 60].map((y) => (
        <rect
          key={`${x}-${y}`}
          x={x + 2}
          y={y + 2}
          width="12"
          height="12"
          fill="#090F1A"
          opacity="0.6"
        />
      ))
    )}
  </svg>
);

// ── Inline SVG: Concentric Stripes / Arcs (Ref 2 Style) ──
const VerticalArcs = () => (
  <svg width="80" height="80" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[18, 32, 46, 60, 74].map((r, i) => (
      <path
        key={i}
        d={`M 90 ${90 - r} Q ${90 - r / 2} 90 ${90 - r} 90`}
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />
    ))}
  </svg>
);

const contactBadges = [
  {
    id: "website",
    icon: <FiGlobe className="w-4 h-4" />,
    label: "casachicinterior.com",
    href: "https://casachicinterior.com",
  },
  {
    id: "phone",
    icon: <FiPhone className="w-4 h-4" />,
    label: "+91-99999-99999",
    href: "tel:+919999999999",
  },
  {
    id: "location",
    icon: <FiMapPin className="w-4 h-4" />,
    label: "Delhi NCR, India",
    href: "https://maps.google.com",
  },
];

export default function PortfolioFooter() {
  return (
    <section
      className="relative w-full overflow-hidden pt-0"
      style={{ backgroundColor: "#F97316" }}
    >
      {/* ── Top: Enhanced Framed Premium Interior Image ── */}
      <div className="relative w-full px-4 md:px-12 pt-12 pb-6">
        {/* Abstract geometric frame element (Ref 1 style dark overlap) */}
        <div className="absolute top-0 right-0 z-10 hidden md:block opacity-90">
          <svg width="350" height="200" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 350 0 L 350 200 L 200 200 L 0 0 Z" fill="#090F1A" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 z-10 hidden md:block opacity-90">
          <svg width="350" height="200" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 200 L 0 0 L 150 0 L 350 200 Z" fill="#090F1A" />
          </svg>
        </div>

        {/* The Image Wrapper with border and frame spacing */}
        <div className="relative w-full max-w-7xl mx-auto z-20">
          {/* Subtle Orange border frame */}
          <div className="absolute -top-3 -left-3 -right-3 -bottom-3 rounded-[2.5rem] border-[3px] border-white/20 z-0" />

          <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white" style={{ height: "380px" }}>
            <Image
              src="https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Premium Interior Space by CasaChic"
              fill
              className="object-cover"
              sizes="100vw"
              priority={true} // Add priority to load footer image faster
            />
            {/* Subtle Gradient Overlay on image */}
            <div className="absolute inset-0 bg-black/10 z-10" />
          </div>
        </div>
      </div>

      {/* ── Bottom: Thank You + Contacts (Ref 2 Style) ── */}
      <div className="relative py-16 px-6 md:px-12 overflow-hidden">

        {/* Static Patterns (Same as Ref 2) */}
        <div className="absolute -top-5 -left-5 z-0 opacity-50">
          <GridPattern />
        </div>

        <div className="absolute top-10 right-10 z-0 hidden md:block opacity-80">
          <ChairIcon />
        </div>

        <div className="absolute -bottom-8 -right-8 z-0 opacity-50">
          <VerticalArcs />
        </div>

        {/* Content — Centered */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-none"
          >
            Thank You So Much
          </motion.h2>

          {/* Primary CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#F97316] text-white px-10 py-5 rounded-full text-lg md:text-xl font-black shadow-2xl hover:bg-white hover:text-[#F97316] transition-all transform hover:scale-105 active:scale-95 border-2 border-transparent hover:border-[#F97316]"
            >
              Book a Free Site Consultation
            </a>
          </motion.div>

          {/* Contact Badges (Same as Ref 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 md:gap-4"
          >
            {contactBadges.map((badge) => (
              <a
                key={badge.id}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-full text-white text-xs md:text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: "#090F1A" }}
              >
                {badge.icon}
                {badge.label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}