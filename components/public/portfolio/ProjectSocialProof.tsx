"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";

interface ProjectSocialProofProps {
  testimonial?: {
    quote: string;
    clientName: string;
    clientPhoto: string;
  };
  designReference?: {
    renderImg: string;
    finalImg: string;
  };
}

export default function ProjectSocialProof({
  testimonial,
  designReference,
}: ProjectSocialProofProps) {
  return (
    <section className="py-24 px-4 md:px-6 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Testimonial Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <FaQuoteLeft className="text-[#F97316]/10 text-9xl absolute -top-10 -left-10" />
            
            <div className="relative z-10">
              <h3 className="text-[#F97316] font-black uppercase tracking-widest text-xs mb-8">
                Client Satisfaction
              </h3>
              
              {testimonial ? (
                <div className="space-y-8">
                  <p className="text-2xl md:text-3xl font-bold text-[#090F1A] leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={testimonial.clientPhoto}
                        alt={testimonial.clientName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[#090F1A] font-black">{testimonial.clientName}</h4>
                      <p className="text-gray-400 text-sm font-bold">Verified CasaChic Homeowner</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-10 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 text-center">
                   <p className="text-gray-400 font-bold">Feedback session scheduled soon.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Design Reference (Render vs Final) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#090F1A] p-4 rounded-[3rem] shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-6 px-4">
              <h3 className="text-white font-black text-xl">The Precision Proof</h3>
              <div className="bg-[#F97316] text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-tighter">
                Render vs Reality
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden">
                  <Image
                    src={designReference?.renderImg || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"}
                    alt="Design Render"
                    fill
                    className="object-cover opacity-60 grayscale"
                  />
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">3D Design Render</div>
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border-4 border-[#F97316]">
                  <Image
                    src={designReference?.finalImg || "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80"}
                    alt="Final Output"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#F97316] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase shadow-lg">Final Execution</div>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-[10px] font-bold mt-8 text-center px-8 uppercase tracking-widest">
              We deliver what we promise. Zero deviation from design.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
