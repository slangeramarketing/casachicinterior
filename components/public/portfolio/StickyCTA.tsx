"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl"
        >
          <div className="bg-[#090F1A]/90 backdrop-blur-lg border border-white/10 p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-4">
            <div className="hidden md:block pl-4">
              <p className="text-white font-black text-sm">Ready to transform?</p>
              <p className="text-gray-400 text-xs font-bold">Free site audit available today.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-[1] md:flex-none flex items-center justify-center gap-2 bg-[#F97316] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-xl"
              >
                Get Similar Quote
              </a>
              
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl hover:scale-110 active:scale-95 transition-transform"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
