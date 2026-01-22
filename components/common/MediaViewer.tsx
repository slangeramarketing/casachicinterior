"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect } from "react";

interface MediaViewerProps {
  images: { url: string; alt?: string; caption?: string }[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function MediaViewer({ images, currentIndex, onClose, onNext, onPrev }: MediaViewerProps) {
  
  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-white text-3xl z-[110] hover:text-[#F97316] transition-colors">
          <FiX />
        </button>

        {/* Navigation Buttons */}
        <button onClick={onPrev} className="absolute left-4 md:left-10 text-white text-4xl z-[110] p-2 hover:bg-white/10 rounded-full transition">
          <FiChevronLeft />
        </button>
        <button onClick={onNext} className="absolute right-4 md:right-10 text-white text-4xl z-[110] p-2 hover:bg-white/10 rounded-full transition">
          <FiChevronRight />
        </button>

        {/* Image Container */}
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="relative w-full h-screen flex flex-col items-center justify-center"
        >
          <img 
            src={images[currentIndex].url} 
            alt={images[currentIndex].alt || "Gallery Image"} 
            className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded"
          />
          {images[currentIndex].caption && (
            <p className="text-white mt-6 text-lg font-medium tracking-wide">
              {images[currentIndex].caption}
            </p>
          )}
          <div className="absolute bottom-0 text-gray-500 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}