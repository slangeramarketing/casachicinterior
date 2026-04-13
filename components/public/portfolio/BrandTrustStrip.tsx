"use client";

import { motion } from "framer-motion";

const BRANDS = [
  "Asian Paints",
  "Hettich",
  "Hafele",
  "CenturyPly",
  "Greenlam",
  "Asian Paints",
  "Hettich",
  "Hafele",
  "CenturyPly",
  "Greenlam",
];

export default function BrandTrustStrip() {
  return (
    <div className="w-full bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Scrolling Strip */}
        <div className="relative overflow-hidden mb-12 py-4 border-y border-gray-100">
          <div className="flex items-center gap-8 mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
              @ Our Quality Partners
            </span>
          </div>
          
          <div className="flex overflow-hidden">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
              className="flex gap-12 items-center whitespace-nowrap"
            >
              {BRANDS.map((brand, idx) => (
                <span
                  key={`${brand}-${idx}`}
                  className="text-xl md:text-3xl font-black text-gray-200 uppercase tracking-tighter"
                >
                  {brand}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="bg-[#090F1A] rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 border-[20px] border-white/5 rounded-full" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-[#F97316] font-black uppercase tracking-widest text-xs mb-3">
                The CasaChic Material Guarantee
              </h3>
              <p className="text-white text-xl md:text-2xl font-bold max-w-2xl leading-tight">
                <span className="text-[#F97316]">Zero Particle Board Policy:</span> We strictly use BWP Marine Ply & HDHMR for long-lasting durability.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full border-4 border-[#F97316] flex items-center justify-center">
                <span className="text-[#F97316] font-black text-xl">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
