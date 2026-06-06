"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa";
import { useState, useRef } from "react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  category: "founder" | "leadership" | "ops";
}

const TEAM: TeamMember[] = [
  { name: "Nishant Poonia", role: "CEO & Founder", image: "/assets/Nishant-Poonia.jpeg", category: "founder" },
  { name: "Ashutosh Goyal", role: "COO & Co-founder", image: "/assets/Ashutosh.jpeg", category: "founder" },
  { name: "Farooq Saifi", role: "Production Head", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80", category: "leadership" },
  { name: "Shivam Jaiswal", role: "VP & Sales Director", image: "/assets/Shivam.jpeg", category: "leadership" },
  { name: "Kanhaiya Nayak", role: "CMO", image: "/assets/kanhainya.png", category: "leadership" },
  { name: "Hanu Arya", role: "Marketing Manager", image: "/assets/hanu.png", category: "ops" },
  { name: "Abhinay Yadav", role: "CTO", image: "/assets/Abhinay-Yadav.png", category: "ops" },
  { name: "Rohit Kumar", role: "Senior Executive", image: "/assets/rohit.png", category: "ops" },
];

const MemberCard = ({ member, isLarge = false, index }: { member: TeamMember; isLarge?: boolean; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="group relative flex flex-col items-center text-center p-8 rounded-[2rem] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md border border-white/[0.05] hover:border-white/[0.15] transition-colors duration-500 [perspective:1000px]"
    >
      {/* Dynamic Shine Overlay */}
      <motion.div
        className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(249,115,22,0.15) 0%, transparent 70%)`,
        }}
      />

      {/* Profile Image with 3D Pop */}
      <div
        className={`relative ${isLarge ? "w-36 h-36 md:w-44 md:h-44" : "w-28 h-28 md:w-36 md:h-36"} mb-8`}
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-orange-500/50 transition-colors duration-500 p-1">
          <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-900 [mask-image:radial-gradient(white,black)] [transform:translateZ(0)]">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              sizes="(max-width: 768px) 150px, 200px"
            />
          </div>
        </div>

        {/* LinkedIn Overlay Badge */}
        <a
          href="#"
          className="absolute bottom-2 right-2 w-10 h-10 bg-orange-500 text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 z-20"
        >
          <FaLinkedinIn className="w-5 h-5" />
        </a>
      </div>

      {/* Content with 3D Pop */}
      <div style={{ transform: "translateZ(20px)" }} className="relative z-10 w-full">
        <h3 className="text-white font-bold text-xl md:text-2xl tracking-tight mb-2">
          {member.name}
        </h3>
        <p className="text-orange-500/90 text-xs font-bold uppercase tracking-[0.25em]">
          {member.role}
        </p>
      </div>

      {/* Subtle bottom gradient line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent group-hover:w-3/4 transition-all duration-700 opacity-0 group-hover:opacity-100" />
    </motion.div>
  );
};

export default function CinematicTeam() {
  return (
    <section className="relative bg-[#050505] py-32 md:py-40 overflow-hidden selection:bg-orange-500 selection:text-black">

      {/* PREMIUM BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-orange-500 rounded-full blur-[250px] opacity-[0.02] pointer-events-none" />

      {/* Animated Floating Particles/Orbs (Subtle) */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[15%] w-32 h-32 bg-orange-500/10 rounded-full blur-[60px]"
      />
      <motion.div
        animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[20%] right-[15%] w-48 h-48 bg-white/5 rounded-full blur-[80px]"
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-orange-500/50" />
              <p className="text-orange-500 text-sm font-bold uppercase tracking-[0.3em]">
                The Execution Force
              </p>
              <div className="w-12 h-[1px] bg-orange-500/50" />
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Meet the Visionaries
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light">
              The masterminds shaping the future of luxury interiors.
            </p>
          </motion.div>
        </div>

        {/* Row 1: Founders */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16 md:mb-20">
          {TEAM.filter(m => m.category === "founder").map((member, i) => (
            <div key={member.name} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(40%-1rem)] max-w-[420px]">
              <MemberCard member={member} isLarge index={i} />
            </div>
          ))}
        </div>

        {/* Row 2: Leadership */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-16 md:mb-20">
          {TEAM.filter(m => m.category === "leadership").map((member, i) => (
            <div key={member.name} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.5rem)] max-w-[340px]">
              <MemberCard member={member} index={i} />
            </div>
          ))}
        </div>

        {/* Row 3: Ops & Tech */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {TEAM.filter(m => m.category === "ops").map((member, i) => (
            <div key={member.name} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.5rem)] max-w-[340px]">
              <MemberCard member={member} index={i} />
            </div>
          ))}
        </div>

        {/* Brand Mission Footer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="mt-32 text-center relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-[50px]" />
          <p className="relative z-10 text-white/80 text-xl md:text-3xl italic max-w-4xl mx-auto leading-relaxed font-light px-4">
            "A dedicated force of experts transforming spaces across Delhi NCR with <span className="text-orange-400 font-medium">precision</span>, <span className="text-orange-400 font-medium">innovation</span>, and <span className="text-orange-400 font-medium">unyielding passion</span>."
          </p>
        </motion.div>

      </div>
    </section>
  );
}
