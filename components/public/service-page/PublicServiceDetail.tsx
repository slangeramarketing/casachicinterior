"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { FiArrowRight, FiChevronDown} from "react-icons/fi";
import { ServiceResponseDTO } from "@/modules/services/service.dto";
import { getInteriorIconById } from "@/public/assets/constants-icons/interior-icons";
import { useState } from "react";
import MediaViewer from "@/components/common/MediaViewer";
import ProcessFlow from "./ProcessFlow";
import ContactSection from "../landing-page/ContactSection";
import VideoShowcase from "./VideoShowcase";
import { OptimizedImage } from "@/components/common/OptimizedImage";

interface PublicServiceDetailProps {
  service: ServiceResponseDTO;
}


// 1. Variants type explicitly add kiya
const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" // Ab ye error nahi dega
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.2 
    }
  }
};


export default function PublicServiceDetail({ service }: PublicServiceDetailProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev !== null && prev < service.gallery.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : service.gallery.length - 1));
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* 1. HERO SECTION - Clean & Bold */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <OptimizedImage 
            src={service.coverImage} 
            alt={service.title} 
            fill 
            priority
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090F1A] via-[#090F1A]/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1 rounded-full bg-[#F97316] text-xs font-bold tracking-widest uppercase mb-4"
          >
            {service.category?.name || "Interior Service"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold mb-6"
          >
            {service.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
          >
            {service.shortDescription}
          </motion.p>
        </div>
      </section>

      {/* 2. HIGHLIGHTS BAR - Icons focus */}
      <section className="relative -mt-16 z-20 max-w-6xl mx-auto px-6">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {service.highlights.slice(0, 4).map((h, i) => {
            const IconNode = getInteriorIconById(h.icon);
            return (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="bg-white p-6 rounded-2xl shadow-xl shadow-black/5 border border-gray-100 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-3">
                  <IconNode size={24} />
                </div>
                <h3 className="text-sm font-bold text-[#090F1A]">{h.title}</h3>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        
        {/* 3. DESCRIPTION SECTION */}
        <motion.section 
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#090F1A] mb-8 relative">
              Design Philosophy
              <span className="block w-12 h-1.5 bg-[#F97316] mt-2"></span>
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
              {service.description}
            </div>
            <div className="mt-10 flex items-center gap-6">
               <div className="bg-[#F2F2F2] px-6 py-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Packages From</p>
                  <p className="text-2xl font-bold text-[#F97316]">₹{service.startingPrice?.toLocaleString()} <span className="text-sm font-normal text-gray-400">/ {service.priceUnit}</span></p>
               </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <OptimizedImage src={service.gallery[0]?.url || service.coverImage} alt="Detail view" fill className="object-cover" />
          </div>
        </motion.section>

        {/* 4. GALLERY - Bento Collage Style */}
        <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }}
        className="space-y-10 py-10"
        >
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#090F1A]">Visual Inspiration</h2>
            <div className="w-16 h-1 bg-[#F97316] mx-auto mt-3 rounded-full" />
            <p className="text-gray-500 mt-4">Discover our portfolio through this curated collage</p>
        </div>

        {/* Bento Grid Logic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 auto-rows-[250px]">
            {service.gallery.map((img, idx) => {
            // Har 1st aur 4th image ko "Large" banane ka logic
            const isLarge = idx === 0 || idx === 3; 

            return (
                <motion.div 
                key={idx}
                variants={fadeInUp}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative rounded overflow-hidden group cursor-zoom-in bg-gray-100 shadow-sm border border-gray-100
                    ${isLarge ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-1 lg:row-span-1"}
                `}
                >
                <img 
                    src={img.url} 
                    alt={img.alt} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                    <span className="text-[#F97316] text-xs font-bold uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    Project Detail
                    </span>
                    <p className="text-white text-base font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {img.caption || "Exquisite Interior Work"}
                    </p>
                </div>
                </motion.div>
            );
            })}
        </div>
        </motion.section>

        {/* Lightbox / Media Viewer (No changes needed in logic) */}
        {selectedImageIndex !== null && (
            <div className="h-screen bg-black">
                <MediaViewer
                images={service.gallery}
                currentIndex={selectedImageIndex}
                onClose={() => setSelectedImageIndex(null)}
                onNext={handleNext}
                onPrev={handlePrev}
            />
            </div>
        )}

        {/* Gallery Section ke baad aur FAQ se pehle */}
        <div className="py-12">
            <ProcessFlow />
        </div>

        <div className="py-12">
            <VideoShowcase data={service.videoShowcase} />
        </div>

        <div className="py-12">
          <ContactSection/>
        </div>

       <div className="py-12">
        {/* 5. FAQS - Clean Accordion */}
        <motion.section 
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        className="max-w-4xl mx-auto py-20"
        >
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#090F1A]">Common Questions</h2>
            <p className="text-gray-500 mt-2">Everything you need to know about this service</p>
        </div>

        <div className="space-y-4">
            {service.faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            
            return (
                <div 
                key={idx} 
                className={`border transition-colors duration-300 rounded-2xl overflow-hidden ${
                    isOpen ? "border-[#F97316] bg-white shadow-lg shadow-orange-500/5" : "border-gray-200 bg-white"
                }`}
                >
                <button 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors"
                >
                    <span className={`font-bold transition-colors ${isOpen ? "text-[#F97316]" : "text-[#090F1A]"}`}>
                    {faq.question}
                    </span>
                    <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? "bg-[#F97316] text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
                    <FiChevronDown />
                    </div>
                </button>

                {/* Smooth Animation Wrapper */}
                <AnimatePresence initial={false}>
                    {isOpen && (
                    <motion.div 
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                        height: "auto", 
                        opacity: 1,
                        transition: {
                            height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }, // Custom Cubic Bezier for smoothness
                            opacity: { duration: 0.25, delay: 0.1 }
                        }
                        }}
                        exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                            height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                            opacity: { duration: 0.2 }
                        }
                        }}
                        className="overflow-hidden" // Essential to prevent jerking
                    >
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                        {faq.answer}
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>
                </div>
            );
            })}
        </div>
        </motion.section>
       </div>

      </div>

      {/* 6. PERSISTENT CTA BLOCK */}
      <section className="bg-[#090F1A] py-24 text-center px-6 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#F97316] rounded-full blur-[120px] opacity-20" />
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Let's craft your space?</h2>
          <p className="text-gray-400 mb-12 text-lg">Your dream interior is just a consultation away.</p>
          <Link 
            href={service.ctaLink || "/contact"}
            className="inline-flex items-center gap-3 bg-[#F97316] text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_10px_40px_-10px_#F97316] transition-all"
          >
            {service.ctaText || "Book a Consultation"}
            <FiArrowRight />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}