"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { FaPlayCircle, FaImages } from "react-icons/fa";

interface VisualShowcaseProps {
  gallery: string[];
  beforeImg: string;
  afterImg: string;
  videoUrl?: string;
  title: string;
}

export default function VisualShowcase({
  gallery,
  beforeImg,
  afterImg,
  videoUrl,
  title,
}: VisualShowcaseProps) {
  return (
    <section className="py-20 bg-gray-50 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#090F1A] mb-4">
            Visual <span className="text-[#F97316]">Showcase</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Experience the transformation through high-resolution captures and immersive walkthroughs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Before/After Slider - Main Focus */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-[#F97316] font-black text-xs">↔</span>
                </div>
                <p className="text-[#090F1A] font-black uppercase tracking-wider text-xs">
                  Transformation Slider
                </p>
              </div>
              <div className="rounded-[2rem] overflow-hidden aspect-[16/9]">
                <BeforeAfterSlider
                  beforeImg={beforeImg}
                  afterImg={afterImg}
                  title={title}
                />
              </div>
            </div>

            {/* Video Walkthrough */}
            <div className="bg-[#090F1A] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col items-center justify-center text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316] opacity-10 blur-[100px] rounded-full" />
              <FaPlayCircle className="w-16 h-16 text-[#F97316] mb-6 animate-pulse" />
              <h3 className="text-2xl font-bold mb-4">Video Walkthrough</h3>
              {videoUrl ? (
                <p className="text-gray-400 mb-8 max-w-sm">Experience the flow of this space in motion. Press below to view the full walkthrough.</p>
              ) : (
                <p className="text-gray-400 mb-8 max-w-sm">A full digital walkthrough is being processed for this project. Check back soon!</p>
              )}
              <button
                className="bg-[#F97316] text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-[#F97316] transition-all"
                onClick={() => videoUrl && window.open(videoUrl, "_blank")}
                disabled={!videoUrl}
              >
                {videoUrl ? "Watch Video" : "Coming Soon"}
              </button>
            </div>
          </div>

          {/* Gallery Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-6">
                <FaImages className="text-[#F97316] text-xl" />
                <p className="text-[#090F1A] font-black uppercase tracking-wider text-xs">
                  Project Gallery
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {gallery.length > 0 ? (
                  gallery.map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="relative aspect-square rounded-[1.5rem] overflow-hidden group shadow-md"
                    >
                      <Image
                        src={img}
                        alt={`${title} view ${i + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="aspect-square bg-gray-50 rounded-[1.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-6">
                    <p className="text-gray-400 font-bold text-sm">More views coming soon!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
