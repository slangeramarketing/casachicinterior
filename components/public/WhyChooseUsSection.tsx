"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  whyChooseUsData,
  positionClasses,
} from "@/lib/data/whyChooseUs";

/* -----------------------------
   Animation constants (TS-safe)
-------------------------------- */
const EASE_IN_OUT: [number, number, number, number] = [0.4, 0, 0.2, 1];

const floatAnimation = (delay: number) => ({
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      delay,
      ease: EASE_IN_OUT,
    },
  },
});

export default function WhyChooseUsSection() {
  return (
    <section className="w-full py-32 bg-[#f8f8f8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex justify-center">

        {/* =========================
            DESKTOP VIEW (UNCHANGED)
        ========================== */}
        <div className="relative hidden lg:flex items-center justify-center min-h-[600px] w-[85%]">

          {/* CENTER */}
          <div className="relative z-10 bg-white rounded-full w-[360px] h-[360px] flex flex-col items-center justify-center text-center shadow-lg px-4">
            <Image
              src="/media/static/why-choose-men.png"
              alt="Why Choose Us"
              width={150}
              height={150}
              className="rounded-full mb-4"
            />

            <h2 className="text-3xl font-bold text-gray-900">
              Why <span className="text-orange-500">Choose</span> Us
            </h2>

            <p className="mt-3 text-sm text-gray-600 px-8">
              Transforming spaces with precision, creativity, and quality craftsmanship.
            </p>
          </div>

          {/* ORBIT ITEMS */}
          {whyChooseUsData.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                {...floatAnimation(item.id * 0.3)}
                className={`absolute ${
                  item.position ? positionClasses[item.position] : ""
                } flex items-center gap-2`}
              >
                <div className="bg-orange-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl">
                  <Icon />
                </div>

                <div className="bg-white px-4 py-2 rounded-md shadow text-sm font-semibold text-gray-800 max-w-[220px]">
                  {item.title}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* =========================
            MOBILE VIEW (ANIMATED)
        ========================== */}
        <div className="lg:hidden w-full">
          <div className="text-center mb-12">
            <Image
              src="/media/static/why-choose-men.png"
              alt="Why Choose Us"
              width={140}
              height={140}
              className="rounded-full mx-auto mb-4"
            />

            <h2 className="text-3xl font-bold text-gray-900">
              Why <span className="text-orange-500">Choose</span> Us
            </h2>

            <p className="mt-3 text-sm text-gray-600 max-w-md mx-auto">
              Transforming spaces with precision, creativity, and quality craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChooseUsData.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                    ease: EASE_IN_OUT,
                  }}
                  className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
                >
                  <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    <Icon />
                  </div>

                  <p className="text-sm font-semibold text-gray-800">
                    {item.title}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
