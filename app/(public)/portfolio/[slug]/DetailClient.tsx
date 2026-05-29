"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface ServiceData {
  slug: string;
  title: string;
  category: string;
  location: string;
  heroImage: string;
  overview: string;
  features: string[];
  gallery: string[];
  process: { title: string; desc: string }[];
}

export default function DetailClient({ service }: { service: ServiceData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <main ref={containerRef} className="relative bg-[#050505] min-h-screen text-[#e5e2e1] selection:bg-[#f97316] selection:text-black overflow-hidden font-sans">
      
      {/* AMBIENT GLOWS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-[#f97316] rounded-full blur-[180px] opacity-10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-[#ffb869] rounded-full blur-[150px] opacity-5 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src={service.heroImage} 
            alt={service.title} 
            fill 
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-[#f97316] uppercase tracking-[0.2em] text-sm font-semibold mb-6">
              {service.category} &middot; {service.location}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              {service.title}
            </h1>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40"
        >
          <span className="text-xs uppercase tracking-[0.2em]">Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* CONTENT GRID */}
      <section className="relative z-20 max-w-[1440px] mx-auto px-6 md:px-16 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* LEFT COL: Overview & Features */}
          <div className="md:col-span-7 space-y-24">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-semibold mb-8 text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>The Vision</h2>
              <p className="text-lg md:text-xl leading-[1.7] text-[#e0c0b1]/80 font-light">
                {service.overview}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="p-8 md:p-12 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <h3 className="text-xl font-semibold mb-8 text-[#f97316]">Signature Elements</h3>
              <ul className="space-y-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] mt-2.5 shrink-0" />
                    <span className="text-[17px] text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* RIGHT COL: Process Steps */}
          <div className="md:col-span-4 md:col-start-9">
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="sticky top-32"
            >
              <h3 className="text-sm uppercase tracking-[0.15em] text-white/40 mb-10 font-semibold">Execution Process</h3>
              <div className="space-y-12">
                {service.process.map((step, i) => (
                  <div key={i} className="relative pl-8">
                    {/* Line connector */}
                    {i !== service.process.length - 1 && (
                      <div className="absolute left-[3px] top-6 bottom-[-3rem] w-[1px] bg-white/10" />
                    )}
                    {/* Node */}
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full border border-[#f97316] bg-[#050505] shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                    
                    <h4 className="text-lg font-medium text-white mb-2">{step.title}</h4>
                    <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="relative z-20 pb-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold mb-12 text-white" 
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            Gallery
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.gallery.map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`relative rounded-xl overflow-hidden group ${i === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'}`}
              >
                <Image 
                  src={img} 
                  alt={`${service.title} Gallery ${i + 1}`} 
                  fill 
                  className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-500 rounded-xl pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="relative z-20 border-t border-white/[0.05] bg-[#0B0B0B]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Ready to transform your space?
            </h2>
            <p className="text-white/60 mb-12 max-w-2xl mx-auto text-lg">
              Book a consultation with our lead architects and begin the journey toward your bespoke living experience.
            </p>
            <button className="bg-[#f97316] text-[#050505] px-10 py-4 rounded-md font-semibold text-lg hover:bg-[#ffb869] transition-colors duration-300">
              Request Consultation
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
