"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiMapPin, FiCalendar } from "react-icons/fi";

interface ProjectDetailHeroProps {
  title: string;
  location: string;
  afterImg: string;
  renovationType: string;
  timelineLabel: string;
  highlights: string[];
}

export default function ProjectDetailHero({
  title,
  location,
  afterImg,
  renovationType,
  timelineLabel,
  highlights,
}: ProjectDetailHeroProps) {
  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Background High-Res Image */}
      <Image
        src={afterImg}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Floating Overlay Card */}
      <div className="absolute inset-0 flex items-end md:items-center justify-start max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-md p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/20 max-w-xl"
        >
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            {renovationType.replace("-", " ")}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-[#090F1A] leading-tight mb-4">
            {title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
              <FiMapPin className="text-[#F97316]" />
              {location}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
              <FiCalendar className="text-[#F97316]" />
              {timelineLabel}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[#090F1A] font-black uppercase tracking-wider text-[10px]">
              Transformation Summary
            </p>
            <ul className="space-y-2">
              {highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-medium leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-1.5 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
