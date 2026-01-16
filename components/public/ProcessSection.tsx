"use client";

import React from "react";
import { FaComments, FaPencilRuler, FaTools, FaHandshake } from "react-icons/fa";
import { motion } from "framer-motion";

/* -------------------------------------
   Types
------------------------------------- */
type Step = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

/* -------------------------------------
   Data
------------------------------------- */
const steps: Step[] = [
  {
    title: "Consultation",
    desc: "We start with understanding your vision, requirements, and budget.",
    icon: <FaComments className="w-10 h-10 text-indigo-600" />,
  },
  {
    title: "Design",
    desc: "Our experts craft personalized designs with moodboards and 3D visuals.",
    icon: <FaPencilRuler className="w-10 h-10 text-indigo-600" />,
  },
  {
    title: "Execution",
    desc: "From materials to finishing, we ensure flawless implementation.",
    icon: <FaTools className="w-10 h-10 text-indigo-600" />,
  },
  {
    title: "Handover",
    desc: "We deliver your transformed space, ready to live and enjoy.",
    icon: <FaHandshake className="w-10 h-10 text-indigo-600" />,
  },
];

/* -------------------------------------
   Step Card (ANIMATED)
------------------------------------- */
function StepCard({
  step,
  index,
  isLast,
}: {
  step: Step;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative bg-white rounded-lg shadow-md p-6 text-center
                 hover:shadow-xl transition duration-300 group"
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition">
          {step.icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm">{step.desc}</p>

      {/* Connector line (desktop only) */}
      {!isLast && (
        <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-indigo-200" />
      )}
    </motion.div>
  );
}

/* -------------------------------------
   Main Section
------------------------------------- */
export default function ProcessSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
          Our Working Process
        </h2>

        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
          A simple, transparent process that ensures your project runs smoothly from start to finish.
        </p>

        {/* Timeline */}
        <div className="mt-12 grid md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <StepCard
              key={idx}
              step={step}
              index={idx}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
