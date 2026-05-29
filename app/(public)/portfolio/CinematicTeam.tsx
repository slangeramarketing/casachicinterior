"use client";

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
  { name: "Nishant Poonia", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80", category: "founder" },
  { name: "Ashutosh Goyal", role: "COO & Co-founder", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", category: "founder" },
  { name: "Farooq Saifi", role: "Production Head", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80", category: "leadership" },
  { name: "Shivam Jaiswal", role: "VP & Sales Director", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", category: "leadership" },
  { name: "Kanhaiya Nayak", role: "CMO", image: "/assets/kanhainya.png", category: "leadership" },
  { name: "Hanu Arya", role: "Marketing Manager", image: "/assets/hanu.png", category: "ops" },
  { name: "Abhinay Yadav", role: "CTO", image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&q=80", category: "ops" },
  { name: "Rohit Kumar", role: "Senior Executive", image: "/assets/rohit.png", category: "ops" },
];

const MemberCard = ({ member, isLarge = false }: { member: TeamMember; isLarge?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ y: -8 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.02] backdrop-blur-xl border-t border-white/[0.05] hover:border-t-[#F97316]/50 transition-all duration-500 overflow-hidden"
  >
    {/* Ambient glow behind image */}
    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#F97316] rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />

    {/* Profile Image */}
    <div className={`relative ${isLarge ? "w-32 h-32 md:w-40 md:h-40" : "w-24 h-24 md:w-32 md:h-32"} rounded-full p-1 border border-white/10 group-hover:border-[#F97316]/60 transition-colors duration-500 mb-6`}>
      <div className="relative w-full h-full rounded-full overflow-hidden bg-[#0a0a0a]">
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
        className="absolute bottom-0 right-0 w-8 h-8 bg-[#F97316] text-[#050505] rounded-full flex items-center justify-center border border-[#050505] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
      >
        <FaLinkedinIn className="w-4 h-4" />
      </a>
    </div>

    {/* Content */}
    <h3 className="text-white font-semibold text-lg md:text-xl tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
      {member.name}
    </h3>
    <p className="text-[#F97316] text-xs font-semibold uppercase tracking-widest mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
      {member.role}
    </p>
  </motion.div>
);

export default function CinematicTeam() {
  return (
    <section className="relative bg-[#050505] py-32 overflow-hidden selection:bg-[#F97316] selection:text-black">
      
      {/* AMBIENT GLOWS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[#F97316] rounded-full blur-[200px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#F97316] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              The Execution Force
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Meet the Visionaries
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#F97316] to-transparent mx-auto rounded-full" />
          </motion.div>
        </div>

        {/* Row 1: Founders */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16">
          {TEAM.filter(m => m.category === "founder").map(member => (
            <div key={member.name} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33%-2rem)] max-w-sm">
              <MemberCard member={member} isLarge />
            </div>
          ))}
        </div>

        {/* Row 2: Leadership */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-16">
          {TEAM.filter(m => m.category === "leadership").map(member => (
            <div key={member.name} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(25%-1.5rem)] max-w-[280px]">
              <MemberCard member={member} />
            </div>
          ))}
        </div>

        {/* Row 3: Ops & Tech */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {TEAM.filter(m => m.category === "ops").map(member => (
            <div key={member.name} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33%-1.5rem)] max-w-[280px]">
              <MemberCard member={member} />
            </div>
          ))}
        </div>

        {/* Brand Mission Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-32 text-center"
        >
          <p className="text-[#e0c0b1]/60 text-base md:text-lg italic max-w-2xl mx-auto leading-relaxed font-light">
            "A dedicated force of experts transforming spaces across Delhi NCR with precision, tech-innovation, and passion."
          </p>
        </motion.div>

      </div>
    </section>
  );
}
