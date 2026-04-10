"use client";

import { OptimizedImage } from "@/components/common/OptimizedImage";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">

      {/* Hero Image — ONLY Zoom Out on Load */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 3,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <OptimizedImage
          src="/assets/hero-wallpaper.png"
          alt="Luxury interior design"
          fill
          priority
          className="object-cover object-center"
        />
      </motion.div>

      {/* Content Card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 max-w-7xl mx-auto px-6 mt-32">
          <div className="max-w-[700px]  bg-[#f9741614]  backdrop-blur-sm p-8 md:p-10 rounded-md">

            <h1 className="text-5xl font-bold text-white leading-tight">
              Beautiful Homes Made
              <br />
              For You Dear.
            </h1>

            <h2 className="mt-4 text-lg md:text-xl font-semibold text-white">
              Where Luxury Meets Comfort
            </h2>

            <p className="mt-3 text-sm md:text-base text-white/90">
              India’s most trusted home interior design service with
              50,000+ happy homes delivered
            </p>

            <Link
              href="/contact"
              className="inline-block mt-6 bg-bg-primary hover:bg-white hover:text-black text-white px-6 py-3 rounded-full text-sm font-semibold transition"
            >
              Book Free Consultation
            </Link>

          </div>
        </div>
      </div>

    </section>
  );
}
