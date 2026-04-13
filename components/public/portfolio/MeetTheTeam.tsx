"use client";

/***************************************************
 * File: components/public/services/MeetTheTeam.tsx
 * Layer: UI – Client Component
 * 
 * Purpose:
 * - Displays the CasaChic leadership and core team.
 * - Reinforces authority, tech-readiness, and execution trust.
 * - Responsive 2-3-3 Hierarchy grid.
 ***************************************************/

import { motion } from "framer-motion";
import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  category: "founder" | "leadership" | "ops";
}

const TEAM: TeamMember[] = [
  // Founders
  {
    name: "Nishant Poonia",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    category: "founder",
  },
  {
    name: "Ashutosh Goyal",
    role: "COO & Co-founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    category: "founder",
  },
  // Leadership
  {
    name: "Farooq Saifi",
    role: "Production Head",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    category: "leadership",
  },
  {
    name: "Shivam Jaiswal",
    role: "VP & Sales Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    category: "leadership",
  },
  {
    name: "Kanhaiya Nayak",
    role: "CMO",
    image: "/assets/kanhainya.png",
    category: "leadership",
  },
  // Ops & Tech
  {
    name: "Hanu Arya",
    role: "Marketing Manager",
    image: "/assets/hanu.png",
    category: "ops",
  },
  {
    name: "Abhinay Yadav",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&q=80",
    category: "ops",
  },
  {
    name: "Rohit Kumar",
    role: "Senior Executive",
    image: "/assets/rohit.png",
    category: "ops",
  },
];

const MemberCard = ({ member, isLarge = false }: { member: TeamMember; isLarge?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
    className="group relative flex flex-col items-center text-center px-4"
  >
    {/* Profile Image Container */}
    <div className={`relative ${isLarge ? "w-32 h-32 md:w-44 md:h-44" : "w-28 h-28 md:w-36 md:h-36"} rounded-full p-1.5 border-2 border-orange-500/20 group-hover:border-orange-500 transition-colors duration-500`}>
      <div className="relative w-full h-full rounded-full overflow-hidden bg-navy-900 shadow-inner">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
      </div>

      {/* LinkedIn Overlay Badge */}
      <a
        href="#"
        className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-7 h-7 md:w-9 md:h-9 bg-[#0077B5] text-white rounded-full flex items-center justify-center border-2 border-[#090F1A] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
      >
        <FaLinkedinIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </a>
    </div>

    {/* Content */}
    <div className="mt-5">
      <h3 className={`font-black text-white ${isLarge ? "text-lg md:text-xl" : "text-base md:text-lg"} tracking-tight`}>
        {member.name}
      </h3>
      <p className="text-[#F97316] font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1">
        {member.role}
      </p>
    </div>
  </motion.div>
);

export default function MeetTheTeam() {
  return (
    <section className="bg-[#090F1A] py-24 relative overflow-hidden">
      {/* Floating Geometric Patterns (Matching Website Aesthetic) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 border border-white rounded-full" />
        <div className="absolute top-40 right-20 w-96 h-96 border border-white rounded-full" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] border-t border-white rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-5 relative z-10">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#F97316] text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            The Execution Force
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            Meet the <span className="text-[#F97316]">Visionaries</span> <br className="hidden md:block" /> Behind CasaChic
          </h2>
          <div className="w-20 h-1 bg-[#F97316] mx-auto mt-8 rounded-full" />
        </div>

        {/* Row 1: Founders */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-24">
          {TEAM.filter(m => m.category === "founder").map(member => (
            <MemberCard key={member.name} member={member} isLarge />
          ))}
        </div>

        {/* Row 2: Leadership */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 mb-24">
          {TEAM.filter(m => m.category === "leadership").map(member => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>

        {/* Row 3: Ops & Tech */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {TEAM.filter(m => m.category === "ops").map(member => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>

        {/* Brand Mission Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 text-center"
        >
          <p className="text-gray-400 text-sm md:text-base italic max-w-2xl mx-auto leading-relaxed">
            &quot;A dedicated force of 8+ experts transforming spaces across Delhi NCR with precision, tech-innovation, and passion.&quot;
          </p>
        </motion.div>

      </div>
    </section>
  );
}
