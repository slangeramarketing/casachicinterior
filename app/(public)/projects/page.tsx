"use client";

import { useMemo, useState } from "react";
import { projects } from "@/lib/data/projects";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiClock, FiArrowRight, FiSearch } from "react-icons/fi";

export default function ProjectsPage() {
  const categories = ["All", "Featured", "Residential", "Office", "Commercial"];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------------- FILTER & SEARCH LOGIC ---------------- */
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Featured" ? project.featured : project.category.toLowerCase() === selectedCategory.toLowerCase());
      
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-[#fcfcfc] min-h-screen pb-20">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden bg-neutral-900">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-600/10 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs">Our Portfolio</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 tracking-tighter">
            CRAFTING <span className="text-orange-500">SPACES</span>,<br /> 
            DELIVERING DREAMS.
          </h1>
          <p className="mt-6 max-w-xl text-neutral-400 text-lg leading-relaxed">
            From modern residences to productive workspaces, explore how CasaChic transforms 
            visions into architectural masterpieces.
          </p>
        </div>
      </section>

      {/* ================= FILTER & SEARCH BAR ================= */}
      <section className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-bg-primary text-white shadow-lg"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Business Search Input */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by project or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* ================= PROJECT GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiSearch className="text-gray-300 text-3xl" />
            </div>
            <p className="text-gray-500 font-medium text-lg text-center">
              We couldn't find any projects matching your search.
            </p>
            <button 
              onClick={() => {setSelectedCategory("All"); setSearchQuery("");}}
              className="mt-4 text-orange-500 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-orange-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
              >
                {/* IMAGE AREA */}
                <div className="relative h-[320px] w-full overflow-hidden">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {project.featured && (
                    <span className="absolute top-5 left-5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      Featured
                    </span>
                  )}
                  
                  {/* Category Tag on Image */}
                  <span className="absolute bottom-5 left-5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg border border-white/30">
                    {project.category}
                  </span>
                </div>

                {/* CONTENT AREA */}
                <div className="p-7">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1"><FiMapPin /> {project.location}</span>
                    <span className="flex items-center gap-1"><FiClock /> {project.duration}</span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {project.shortDescription}
                  </p>

                  <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-2 text-sm font-black text-neutral-900 group/btn"
                    >
                      EXPLORE PROJECT 
                      <FiArrowRight className="transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="max-w-5xl mx-auto px-6 mt-10">
        <div className="bg-neutral-900 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-600/10 blur-[80px] rounded-full"></div>
            <h2 className="text-3xl md:text-4xl font-black text-white relative z-10 leading-tight">
              HAVE A VISION FOR YOUR <br /><span className="text-orange-500">OWN SPACE?</span>
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 mt-10 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-black text-sm transition-all hover:scale-105 shadow-xl shadow-orange-500/20 relative z-10"
            >
              LET'S GET STARTED <FiArrowRight />
            </Link>
        </div>
      </section>
    </div>
  );
}