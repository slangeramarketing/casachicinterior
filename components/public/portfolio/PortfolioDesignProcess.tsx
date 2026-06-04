"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { designProcessData } from "@/lib/data/designProcess";
import { useRef } from "react";

interface Props {
  theme?: "light" | "dark";
}

export default function PortfolioDesignProcess({ theme = "light" }: Props) {
  const isDark = theme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const total = designProcessData.length;
  // Rotate just enough so the last card ends up exactly at the front (0 deg)
  const maxRotation = -(360 / total) * (total - 1);
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, maxRotation]);

  return (
    <section 
      ref={containerRef} 
      className={`w-full relative z-50 ${isDark ? 'bg-[#050505]' : 'bg-[#fafafa]'}`}
    >
      {/* 
        Tall container to drive scroll for the 3D Carousel (Mobile & Desktop).
        The sticky div sits inside it and sticks until the 400vh is consumed.
      */}
      <div className="h-[400vh] w-full">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden [perspective:1200px]">
          
          {/* Content Wrapper to shift everything slightly up for perfect visual centering */}
          <div className="flex flex-col items-center justify-center w-full -mt-12 md:-mt-20">
            {/* HEADER */}
            <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24 z-50 px-4">
              <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Our <span className="text-orange-500">Design</span> Process
              </h2>
              <p className={`mt-2 md:mt-4 text-sm md:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                A clear, connected, and transparent journey from idea to execution.
              </p>
            </div>

            {/* 3D CAROUSEL */}
            <motion.div 
              className="relative w-full max-w-[240px] md:max-w-[280px] h-[320px] md:h-[360px] [transform-style:preserve-3d]"
              style={{ rotateY: rotationY }}
            >
              {designProcessData.map((step, index) => {
                const Icon = step.icon;
                const angle = (360 / total) * index;
                
                return (
                  <div
                    key={step.id}
                    className={`absolute inset-0 p-4 md:p-5 rounded-3xl border shadow-xl flex flex-col justify-center ${isDark ? 'bg-zinc-900 border-white/5 shadow-orange-500/10' : 'bg-white border-gray-200'}`}
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(320px)`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 shrink-0">
                      <Icon className="text-orange-500 text-xl md:text-2xl" />
                    </div>

                    <span className="text-[10px] md:text-xs font-semibold text-orange-500 tracking-widest uppercase">
                      Step {step.id}
                    </span>

                    <h3 className={`mt-1 md:mt-2 text-lg md:text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>

                    <p className={`mt-2 text-xs md:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Scroll Hint */}
          <div className={`absolute bottom-[6vh] flex items-center gap-4 text-[10px] md:text-xs tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="w-8 md:w-12 h-px bg-orange-500/50" />
            Scroll to explore
            <div className="w-8 md:w-12 h-px bg-orange-500/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
