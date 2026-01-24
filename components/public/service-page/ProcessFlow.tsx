"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { 
  FiMessageSquare, FiPenTool, FiBox, FiSettings, FiAward 
} from "react-icons/fi";

// SEO HowTo Schema logic yahan define kar sakte hain
const processSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Our Interior Design Process",
  "step": [
    { "@type": "HowToStep", "text": "Consultation & Requirement Analysis" },
    { "@type": "HowToStep", "text": "Concept Design & Layout Planning" },
    { "@type": "HowToStep", "text": "3D Visualization & Material Finalization" },
    { "@type": "HowToStep", "text": "Execution & Supervision" },
    { "@type": "HowToStep", "text": "Final Handover & Quality Check" }
  ]
};

const steps = [
  {
    icon: <FiMessageSquare size={28} />,
    title: "Consultation",
    desc: "Understanding your vision, lifestyle, and budget requirements."
  },
  {
    icon: <FiPenTool size={28} />,
    title: "Planning",
    desc: "Drafting layouts and conceptual designs for space optimization."
  },
  {
    icon: <FiBox size={28} />,
    title: "Visualization",
    desc: "Creating realistic 3D models and finalizing materials."
  },
  {
    icon: <FiSettings size={28} />,
    title: "Execution",
    desc: "On-site work supervision with strict quality control."
  },
  {
    icon: <FiAward size={28} />,
    title: "Handover",
    desc: "Final walkthrough and handing over your dream space."
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const ProcessFlow: React.FC = () => {
  return (
    <section className="w-full px-6">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(processSchema) }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl md:text-5xl font-bold text-[#090F1A]"
          >
            How We <span className="text-[#F97316]">Transform</span> Your Space
          </motion.h2>
          <div className="w-24 h-1.5 bg-[#F97316] mx-auto mt-4 rounded-full" />
        </div>

        <div className="relative">
          {/* Connector Line - Desktop Only */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-[#F97316]"
            />
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10"
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={cardVariants} className="flex flex-col items-center group">
                {/* Icon Circle */}
                <div className="w-24 h-24 rounded-2xl bg-white border-2 border-transparent group-hover:border-[#F97316] shadow-xl flex items-center justify-center text-[#090F1A] group-hover:bg-[#F97316] group-hover:text-white transition-all duration-500 mb-6 relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-orange-400 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    0{index + 1}
                  </div>
                  {step.icon}
                </div>

                {/* Text Content */}
                <h3 className="text-lg font-bold text-[#090F1A] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 text-center leading-relaxed px-4">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;