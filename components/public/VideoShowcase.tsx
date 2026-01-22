"use client"; // Sabse upar hona chahiye

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // 'motion' ke liye
import { Swiper, SwiperSlide } from "swiper/react"; // Swiper components
import {} from "swiper/modules"; // Modules
import {FiPlayCircle } from "react-icons/fi";

// Swiper CSS (Inka hona bahut zaroori hai warna slider nahi dikhega)

// props ka structure define karein
interface VideoShowcaseProps {
  data: {
    reels: Array<{ url: string; thumbnail?: string; title?: string }>;
    youtube: Array<{ embedId: string; title?: string; description?: string }>;
  };
}

export default function VideoShowcase({ data }: VideoShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"reels" | "youtube">("reels");

  // Agar data hi nahi hai toh section dikhane ka koi matlab nahi
  if (!data || (data.reels.length === 0 && data.youtube.length === 0)) return null;

  return (
    <section className="w-full py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header (Same as before) */}
        
        <div className="relative w-full"> 
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}>
              <Swiper>
                {activeTab === "reels" ? (
                  data.reels.map((reel, idx) => ( // data.reels use karein
                    <SwiperSlide key={idx}>
                      <div className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                        {/* Thumbnail check: Agar thumbnail nahi hai toh placeholder dikhayein */}
                        <img 
                          src={reel.thumbnail || "https://images.unsplash.com/photo-1551288049-bbbda536ad39?q=80&w=500"} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          alt={reel.title} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-6">
                          <p className="text-white font-bold text-sm mb-3">{reel.title}</p>
                          <a href={reel.url} target="_blank" className="flex items-center gap-2 text-[#F97316] text-[10px] uppercase tracking-widest font-bold bg-white w-fit px-5 py-2.5 rounded-full hover:bg-[#F97316] hover:text-white transition-all">
                            <FiPlayCircle size={16}/> Watch Reel
                          </a>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  data.youtube.map((video, idx) => ( // data.youtube use karein
                    <SwiperSlide key={idx}>
                      <div className="space-y-4">
                        <div className="aspect-video rounded-[2rem] overflow-hidden shadow-xl bg-black border-4 border-white">
                          <iframe 
                            className="w-full h-full border-none" 
                            src={`https://www.youtube.com/embed/${video.embedId}`} 
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="px-2">
                            <h3 className="text-lg font-bold text-[#090F1A]">{video.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-1">{video.description}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Styles (Same as before) */}
    </section>
  );
}