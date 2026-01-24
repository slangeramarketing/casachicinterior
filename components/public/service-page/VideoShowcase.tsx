"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceVideoShowcaseDTO } from "@/modules/services/service.dto";
import { useResponsiveItems } from "@/components/common/useResponsiveItems";
import { MediaGallery } from "@/components/common/MediaGallery";
import { MediaCard } from "../MediaCard";
import { OptimizedImage } from "@/components/common/OptimizedImage";

interface VideoShowcaseProps {
  data:ServiceVideoShowcaseDTO
}






export default function VideoShowcase({ data }: VideoShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"reels" | "youtube">("reels");

  if (!data.enabled) return null;

  if (data.reels.length === 0 && data.youtube.length === 0) {
    return null;
  }

    const reelsItemsPerView = useResponsiveItems({
    mobile: 1,
    tablet: 2,
    desktop: 4,
    wide: 5,
  });

  const youtubeItemsPerView = useResponsiveItems({
    mobile: 1,
    tablet: 2,
    desktop: 3,
  });



  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-10">
          {["reels", "youtube"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2 rounded-full text-sm font-bold ${
                activeTab === tab
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab === "reels" ? "Reels" : "YouTube"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* REELS */}
            {activeTab === "reels" && (
              <MediaGallery itemsPerView={reelsItemsPerView}>
                {data.reels.map((reel, idx) => (
                  <MediaCard key={idx} aspect="9/16">
                    <OptimizedImage
                      src={reel.thumbnail || ""}
                      alt={reel.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent p-4 flex flex-col justify-end">
                      <p className="text-white text-xs font-bold mb-2">
                        {reel.title}
                      </p>
                      <a
                        href={reel.url}
                        target="_blank"
                        className="flex items-center gap-2 text-[10px] uppercase font-bold bg-white text-orange-500 w-fit px-4 py-2 rounded-full"
                      >
                        Watch
                      </a>
                    </div>
                  </MediaCard>
                ))}
              </MediaGallery>
            )}


            {/* YOUTUBE */}
            {activeTab === "youtube" && (
              <MediaGallery itemsPerView={youtubeItemsPerView}>
                {data.youtube.map((video, idx) => (
                  <MediaCard key={idx} aspect="16/9">
                    <iframe
                      className="w-full h-full border-none"
                      src={`https://www.youtube.com/embed/${video.embedId}`}
                      allowFullScreen
                    />
                  </MediaCard>
                ))}
              </MediaGallery>
            )}


          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
