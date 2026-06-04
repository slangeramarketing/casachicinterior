"use client";

import * as Fi from "react-icons/fi";
import ProjectGallery from "@/components/public/ProjectGallery";
import Link from "next/link";
import { Project } from "@/lib/data/projects";

interface ProjectsProps{
    project:Project
}
export default function PublicDetailProject({project}:ProjectsProps) {

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT: GALLERY (Sticky on Desktop) */}
          <div className="lg:w-3/5">
            <div className="sticky top-32">
              <ProjectGallery
                images={[project.coverImage, ...project.galleryImages]}
              />
              {/* Subtle accent under gallery */}
              <div className="mt-8 flex items-center gap-3">
                <span className="h-[1px] flex-1 bg-gray-100"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                  Slide to explore interior details
                </p>
                <span className="h-[1px] flex-1 bg-gray-100"></span>
              </div>
            </div>
          </div>

          {/* RIGHT: PROJECT INTRO & QUICK STATS */}
          <div className="lg:w-2/5 space-y-10">
            <div className="space-y-4">
              <span className="inline-block bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 leading-tight tracking-tighter">
                {project.title}
              </h1>
              <p className="text-gray-500 leading-relaxed text-lg">
                {project.shortDescription}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4 p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl rounded-full"></div>
               <InfoItem label="Location" value={project.location} icon={<Fi.FiMapPin />} />
               <InfoItem label="Timeline" value={project.duration} icon={<Fi.FiClock />} />
               <InfoItem label="Project Status" value={project.status} icon={<Fi.FiCheckCircle />} />
               <InfoItem label="Execution" value={project.executionModel} icon={<Fi.FiLayers />} />
            </div>

            <div className="pt-4">
                <Link href="/contact" className="group flex items-center justify-between w-full bg-neutral-900 text-white p-6 rounded-2xl font-bold hover:bg-orange-600 transition-all">
                    Plan your space like this
                    <Fi.FiArrowRight className="transition-transform group-hover:translate-x-2" />
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CASE STUDY DETAILS ================= */}
      <section className="bg-white border-t border-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Project Overview */}
          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-3">
                    <span className="h-px w-8 bg-orange-500"></span> Overview
                </h2>
                <div className="text-gray-600 leading-[1.8] text-lg first-letter:text-4xl first-letter:font-black first-letter:text-neutral-900">
                    {project.overview}
                </div>
            </div>

            {/* Material Showcase */}
            <div className="space-y-8 p-10 bg-neutral-50 rounded-[3rem] border border-neutral-100">
                <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
                    Premium Materials <span className="text-orange-500">Selected</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.materials.map((item, i) => {
                        const Icon = item.icon ? (Fi as any)[item.icon] : Fi.FiCheckCircle;
                        return (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                                <Icon size={20} />
                            </div>
                            <span className="text-gray-700 font-medium">{item.text}</span>
                        </div>
                        );
                    })}
                </div>
            </div>
          </div>

          {/* Execution & Quality */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-12">
                <div className="space-y-8">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-3">
                        <span className="h-px w-8 bg-orange-500"></span> Quality & Workforce
                    </h2>
                    
                    <div className="space-y-6">
                        {project.workforce.map((item, i) => {
                            const Icon = (Fi as any)[item.icon];
                            return (
                            <div key={i} className="flex gap-6 p-6 bg-white border border-gray-50 rounded-2xl hover:shadow-md transition-shadow">
                                <div className="text-orange-500"><Icon size={24} /></div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                                    <p className="font-bold text-neutral-800">{item.value}</p>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>

                {/* Assurance Card */}
                <div className="p-8 bg-orange-500 rounded-[2.5rem] text-white space-y-4">
                    <Fi.FiShield size={32} />
                    <h3 className="text-xl font-bold">Standard of Excellence</h3>
                    <p className="text-orange-100 text-sm leading-relaxed">
                        {project.qualityAssurance}
                    </p>
                </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

function InfoItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-orange-500 text-sm font-bold uppercase tracking-tighter">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-neutral-700 font-black text-sm">{value}</p>
    </div>
  );
}