"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiCheckCircle, FiChevronDown } from "react-icons/fi";
import ContactSection from "@/components/public/landing-page/ContactSection";
import { DummyService } from "@/lib/data/dummy-services";

export default function ServiceDetailClient({ service }: { service: DummyService }) {
  return (
    <main className="w-full bg-[#050505] min-h-screen text-white selection:bg-orange-500 selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center">
        <Image
          src={service.heroImage}
          alt={service.title}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight drop-shadow-2xl" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            {service.title}
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow-md">
            {service.shortDescription}
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 space-y-32 py-20">
        
        {/* 2. HIGHLIGHT AS CARD CHIP SECTION MINI (RAW MATERIALS) */}
        <section className="overflow-hidden relative w-full pt-10">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 40s linear infinite;
              display: flex;
              width: max-content;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="text-center mb-12 px-6">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Premium Materials <span className="text-orange-500">Guaranteed</span></h2>
            <p className="text-gray-400">We partner with the world's leading brands to ensure uncompromising quality.</p>
          </div>

          <div className="relative w-full flex">
            {/* Left and Right Fade overlays for smoother look */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
            
            <div className="animate-marquee gap-4 md:gap-6 px-4">
              {[...service.rawMaterials, ...service.rawMaterials].map((mat, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-full pr-8 pl-2 py-2 hover:border-orange-500/50 transition-colors shrink-0 group cursor-default">
                  {/* Logo Container */}
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-shadow">
                    <img 
                      src={`https://logo.clearbit.com/${(mat as any).domain}`} 
                      alt={mat.brand} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<span class="text-black font-bold text-xl">${mat.brand.charAt(0)}</span>`;
                      }}
                    />
                  </div>
                  {/* Text Container */}
                  <div className="flex flex-col justify-center">
                    <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em] block mb-0.5 leading-none">{mat.name}</span>
                    <span className="font-bold text-white text-sm md:text-base tracking-wide leading-none">{mat.brand}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. SHORT ABOUT THAT SERVICE WITH IMAGE */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden border border-white/10">
            <Image src={service.about.image} alt="About Service" fill className="object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">About the <span className="text-orange-500">Service</span></h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {service.about.text}
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-300"><FiCheckCircle className="text-orange-500" /> End-to-end execution</li>
              <li className="flex items-center gap-3 text-gray-300"><FiCheckCircle className="text-orange-500" /> Timely delivery guaranteed</li>
              <li className="flex items-center gap-3 text-gray-300"><FiCheckCircle className="text-orange-500" /> Complete transparency</li>
            </ul>
          </div>
        </section>

        {/* 4. IMAGE GALLERY */}
        <section>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Project <span className="text-orange-500">Gallery</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.gallery.map((img, i) => (
              <div key={i} className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden group">
                <Image src={img} alt={`Gallery ${i+1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            ))}
          </div>
        </section>

        {/* 5. CINEMATIC VIDEO SHOWCASE */}
        {service.videos && service.videos.length > 0 && (
          <section className="w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Video <span className="text-orange-500">Showcase</span></h2>
            <div className="relative w-full aspect-video lg:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(249,115,22,0.1)] group bg-zinc-900">
              <video 
                src={service.videos[0]} 
                className="w-full h-full object-cover" 
                controls
                autoPlay 
                loop 
                muted 
                playsInline
              />
            </div>
          </section>
        )}

        {/* 6. HOW WE TRANSFORM THIS (STEPS) */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How We <span className="text-orange-500">Transform</span></h2>
            <p className="text-gray-400">Our proven step-by-step methodology ensures flawless execution.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {service.steps.map((step, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
                <div className="text-6xl font-black text-white/[0.05] absolute -top-4 -right-4 group-hover:text-orange-500/10 transition-colors">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-bold mb-4 relative z-10 text-orange-500">{step.title}</h3>
                <p className="text-gray-400 relative z-10">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. FAQ SECTION */}
        <section className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked <span className="text-orange-500">Questions</span></h2>
          </div>
          <div className="space-y-4">
            {service.faqs.map((faq, i) => (
              <details key={i} className="group bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 open:bg-white/[0.04] transition-colors cursor-pointer">
                <summary className="flex justify-between items-center font-bold text-lg list-none">
                  {faq.question}
                  <FiChevronDown className="transform group-open:rotate-180 transition-transform text-orange-500" />
                </summary>
                <p className="mt-4 text-gray-400 leading-relaxed">
                  {faq.answer || (faq as any).point}
                </p>
              </details>
            ))}
          </div>
        </section>

      </div>

      {/* 7 & 9. CONTACT FORM & CALL TO ACTION */}
      <ContactSection theme="dark" />

    </main>
  );
}
