"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/data/projects";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const TABS = ["All", "Residential", "Commercial", "Kitchen", "Bedroom", "Renovation"];

export default function FilterableProjectsGrid() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredProjects = projects.filter((project) => {
    if (activeTab === "All") return true;
    if (activeTab === "Residential") return project.category.includes("Residential");
    if (activeTab === "Commercial") return project.category.includes("Commercial") || project.category.includes("Office");
    return project.category.includes(activeTab);
  });

  return (
    <section className="py-24 bg-[#050505] min-h-screen text-white selection:bg-orange-500 selection:text-black">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Project <span className="text-orange-500">Gallery</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
              Explore our complete portfolio of meticulously crafted spaces, from luxury villas to modern commercial hubs.
            </p>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                activeTab === tab ? "text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-orange-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative flex flex-col bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden hover:border-orange-500/30 transition-colors duration-500"
              >
                {/* Image Container */}
                <div className="relative h-[320px] md:h-[400px] w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full">
                    {project.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-500 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                    {project.shortDescription}
                  </p>
                  
                  <Link 
                    href={`/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors group/btn"
                  >
                    View Project
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center group-hover/btn:bg-orange-500/20 transition-colors">
                      <FiArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-xl">No projects found for this category.</p>
          </motion.div>
        )}

      </div>
    </section>
  );
}
