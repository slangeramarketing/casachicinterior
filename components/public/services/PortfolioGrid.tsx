"use client";

/***************************************************
 * File: components/public/services/PortfolioGrid.tsx
 * Layer: UI – Client Component
 *
 * Changes:
 * - Desktop layout: 3 cards per row (lg:grid-cols-3).
 * - Compact card padding and height for better fit.
 * - Optimized fonts for 3-column layout.
 ***************************************************/

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioItemDTO } from "@/modules/services/portfolio/portfolio.dto";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { FaVrCardboard, FaMoneyBillWave, FaCertificate } from "react-icons/fa";
import { MdSensors } from "react-icons/md";
import { FiClock, FiDollarSign } from "react-icons/fi";

const TRUST_EDGES = [
  {
    icon: <FaVrCardboard className="w-6 h-6" />,
    title: "VR Tour Preview",
    desc: "Virtual walk-through before work.",
  },
  {
    icon: <MdSensors className="w-6 h-6" />,
    title: "LiDAR Scanning",
    desc: "Precision 3D measurements.",
  },
  {
    icon: <FaMoneyBillWave className="w-6 h-6" />,
    title: "Fixed Pricing",
    desc: "Zero hidden charges, ever.",
  },
];

const RENO_FILTERS = [
  { label: "All", value: "all" },
  { label: "Kitchen", value: "modular-kitchen" },
  { label: "Living", value: "living-room" },
  { label: "Bedroom", value: "bedroom" },
  { label: "Full Home", value: "full-home" },
];

interface PortfolioGridProps {
  projects: PortfolioItemDTO[];
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.renovationType === activeFilter);

  return (
    <section className="w-full py-12 px-4 md:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 text-center md:text-left">
          <p className="text-[#F97316] font-bold uppercase tracking-widest text-[10px] mb-2">
            Our Transformations
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-[#090F1A] mb-3">
            Real Homes. Real Results.
          </h2>
          <p className="text-gray-500 max-w-lg text-xs md:text-sm">
            Every project carries our promise — transparent costs and premium brands.
          </p>
        </div>

        {/* Trust-Edge Grid - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {TRUST_EDGES.map((edge) => (
            <div
              key={edge.title}
              className="flex gap-3 items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <span className="text-[#F97316] flex-shrink-0">{edge.icon}</span>
              <div>
                <h3 className="font-bold text-[#090F1A] text-xs">
                  {edge.title}
                </h3>
                <p className="text-gray-400 text-[10px] leading-tight">{edge.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {RENO_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-bold transition-all ${activeFilter === f.value
                  ? "bg-[#F97316] text-white shadow-md"
                  : "bg-white text-gray-500 border border-gray-200"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Project Grid - 3 Columns on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[1.5rem] overflow-hidden shadow-lg shadow-gray-200/40 border border-gray-100 flex flex-col"
              >
                {/* Before/After Slider - Compact Height */}
                <div className="h-56 md:h-60 relative w-full overflow-hidden">
                  <BeforeAfterSlider
                    beforeImg={project.beforeImg}
                    afterImg={project.afterImg}
                    title={project.title}
                  />
                  {project.featured && (
                    <div className="absolute top-3 left-3 z-20 bg-[#F97316] text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg uppercase">
                      Featured
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-3">
                    <p className="text-[9px] text-[#F97316] font-black uppercase tracking-wider mb-0.5">
                      {project.location}
                    </p>
                    <h3 className="text-lg font-bold text-[#090F1A] leading-tight truncate">
                      {project.title}
                    </h3>
                  </div>

                  {/* Budget & Time Grid - Compact */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-orange-50/50 border border-orange-100 p-2.5 rounded-xl">
                      <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">Budget</p>
                      <p className="text-xs font-black text-[#F97316] truncate">
                        {project.costRange}
                      </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                      <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">Time</p>
                      <p className="text-xs font-black text-[#090F1A] truncate">
                        {project.timelineLabel}
                      </p>
                    </div>
                  </div>

                  {/* Material Scroll */}
                  <div className="mb-4">
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                      {project.materialSpecList.map((m) => (
                        <span
                          key={`${m.brand}-${m.category}`}
                          className="flex-shrink-0 text-[#090F1A] text-[9px] font-bold px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 whitespace-nowrap"
                        >
                          {m.brand}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                      className="text-[#F97316] text-[10px] font-black uppercase tracking-tight"
                    >
                      {expandedId === project.id ? "Less" : "Details"}
                    </button>
                    <div className="flex -space-x-1">
                      {/* Subtle placeholder for CasaChic branding */}
                      <div className="w-5 h-5 rounded-full bg-[#090F1A] border-2 border-white" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === project.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <ul className="pt-4 space-y-2">
                          {project.highlights.slice(0, 3).map((h) => (
                            <li key={h} className="flex items-start gap-2 text-[11px] text-gray-500 font-medium">
                              <span className="w-1 h-1 rounded-full bg-[#F97316] mt-1.5 flex-shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}