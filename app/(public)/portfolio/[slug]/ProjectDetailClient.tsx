"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ContactSection from "@/components/public/landing-page/ContactSection";
import ReviewSection from "@/components/public/landing-page/ReviewSection";
import { Project } from "@/lib/data/projects";
import { FiCheckCircle } from "react-icons/fi";
import { ReviewResponseDTO } from "@/modules/review/review.dto";

export default function ProjectDetailClient({ project, reviews }: { project: Project, reviews: ReviewResponseDTO[] }) {
  // Grab the first 2-3 images for the "Multiple Angle" section, and the rest for the gallery
  const angleImages = project.galleryImages.slice(0, 3);
  const galleryImages = project.galleryImages.slice(3).length > 0 ? project.galleryImages.slice(3) : project.galleryImages;

  return (
    <main className="w-full bg-[#050505] min-h-screen text-white selection:bg-orange-500 selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[70vh] md:h-[90vh] w-full flex items-center justify-center">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <p className="text-orange-500 uppercase tracking-[0.2em] text-sm font-semibold mb-6">
            {project.category} &middot; {project.location}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight drop-shadow-2xl" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            {project.title}
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow-md">
            {project.shortDescription}
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 space-y-32 py-20">
        
        {/* OVERVIEW SECTION */}
        <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Project <span className="text-orange-500">Overview</span></h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
            {project.overview}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2"><FiCheckCircle className="text-orange-500" /> {project.duration}</div>
            <div className="flex items-center gap-2"><FiCheckCircle className="text-orange-500" /> {project.executionModel}</div>
            <div className="flex items-center gap-2"><FiCheckCircle className="text-orange-500" /> {project.status}</div>
          </div>
        </section>

        {/* 2. MATERIAL USED (Animated Marquee) */}
        {project.materials && project.materials.length > 0 && (
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
              <h2 className="text-2xl md:text-4xl font-bold mb-4">Materials <span className="text-orange-500">Used</span></h2>
              <p className="text-gray-400">We partner with the world's leading brands to ensure uncompromising quality.</p>
            </div>

            <div className="relative w-full flex">
              <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
              
              <div className="animate-marquee gap-4 md:gap-6 px-4">
                {[...project.materials, ...project.materials].map((mat, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-full pr-8 pl-2 py-2 hover:border-orange-500/50 transition-colors shrink-0 group cursor-default">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-shadow">
                      <img 
                        src={`https://logo.clearbit.com/${mat.domain || 'apple.com'}`} 
                        alt={mat.brand || 'Brand'} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const initial = mat.brand ? mat.brand.charAt(0) : mat.text.charAt(0);
                          e.currentTarget.parentElement!.innerHTML = `<span class="text-black font-bold text-xl">${initial}</span>`;
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em] block mb-0.5 leading-none">{mat.text}</span>
                      <span className="font-bold text-white text-sm md:text-base tracking-wide leading-none">{mat.brand || 'Premium'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. MULTIPLE ANGLE IMAGES */}
        {angleImages.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold">Multiple <span className="text-orange-500">Angles</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {angleImages[0] && (
                <div className="md:col-span-8 relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden group">
                  <Image src={angleImages[0]} alt="Angle 1" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              )}
              <div className="md:col-span-4 flex flex-col gap-6">
                {angleImages[1] && (
                  <div className="relative h-[200px] md:h-[288px] rounded-3xl overflow-hidden group">
                    <Image src={angleImages[1]} alt="Angle 2" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                )}
                {angleImages[2] && (
                  <div className="relative h-[200px] md:h-[288px] rounded-3xl overflow-hidden group">
                    <Image src={angleImages[2]} alt="Angle 3" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 4. IMAGE GALLERY */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold">Image <span className="text-orange-500">Gallery</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden group">
                <Image src={img} alt={`Gallery ${i+1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            ))}
          </div>
        </section>

        {/* 5. CINEMATIC VIDEO PROOF */}
        {project.video && (
          <section className="w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Video <span className="text-orange-500">Proof</span></h2>
            <div className="relative w-full aspect-video lg:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(249,115,22,0.1)] group bg-zinc-900">
              <video 
                src={project.video} 
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

      </div>

      {/* 6. TESTIMONIAL SECTION */}
      <div className="mt-20">
        <ReviewSection reviews={reviews} theme="dark" />
      </div>

      {/* 7 & 8. CONTACT FORM / CTA */}
      <ContactSection theme="dark" />

    </main>
  );
}
