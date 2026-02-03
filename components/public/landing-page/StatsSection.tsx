"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiHome, FiSmile, FiCalendar, FiMapPin } from "react-icons/fi";

/* =========================
   Count Up Hook
========================= */
function useCountUpOnView(target: number, duration = 1200) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 } // 40% visible
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let current = 0;
    const increment = Math.ceil(target / (duration / 16));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { ref, count };
}


/* =========================
   Component
========================= */
export default function StatsSection() {
    const projects = useCountUpOnView(150);
    const clients = useCountUpOnView(120);
    const years = useCountUpOnView(5);
    const cities = useCountUpOnView(10);


  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#090F1A]">
            Trusted by Homeowners Across <span className="text-[#F97316]">Delhi NCR</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Proven experience. Real results. Designed for modern living.
          </p>
        </motion.div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <StatCard
            icon={<FiHome />}
            value={projects.count}
            label="Projects Delivered"
            innerRef={projects.ref}
           />

            <StatCard
            icon={<FiSmile />}
            value={clients.count}
            label="Happy Clients"
            innerRef={clients.ref}
            />

            <StatCard
            icon={<FiCalendar />}
            value={years.count}
            label="Years of Experience"
            innerRef={years.ref}
            />

            <StatCard
            icon={<FiMapPin />}
            value={cities.count}
            label="NCR Locations Served"
            innerRef={cities.ref}
            />


        </div>
      </div>
    </section>
  );
}

/* =========================
   Stat Card
========================= */
function StatCard({
  icon,
  value,
  label,
  innerRef,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  innerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={innerRef}
      className="bg-[#F9FAFB] rounded-lg p-8 text-center border border-gray-100 hover:border-[#F97316]/40 transition"
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-md bg-[#F97316]/10 flex items-center justify-center text-[#F97316] text-xl">
        {icon}
      </div>

      <div className="text-3xl md:text-4xl font-bold text-[#090F1A]">
        {value}+
      </div>

      <p className="mt-2 text-sm text-gray-500 font-medium">
        {label}
      </p>
    </div>
  );
}

