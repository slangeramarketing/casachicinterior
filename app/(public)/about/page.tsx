"use client";

import { aboutData } from "@/lib/data/about";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AboutPage() {
  return (
    <main className="bg-white text-black">

      {/* ================= HERO ================= */}
      <section className="py-32 bg-bg-secondary">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About{" "}
            <span className="text-color-primary">
              {aboutData.brand}
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-gray-700 text-base md:text-lg">
            {aboutData.tagline}
          </p>
        </motion.div>
      </section>

      {/* ================= BRAND STORY ================= */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <h2 className="text-3xl font-semibold mb-4">
              Who We Are
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {aboutData.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="bg-bg-secondary p-8 rounded-2xl border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-3 text-color-primary">
              Design Philosophy
            </h3>
            <p className="text-gray-700">
              We believe interiors should not only look beautiful but also
              enhance the way people live, work, and feel inside a space.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="bg-bg-secondary py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          {[aboutData.mission, aboutData.vision].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: EASE,
              }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-amber-600"
            >
              <h3 className="text-2xl font-semibold mb-3 text-color-primary">
                {item.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold">
              Our <span className="text-color-primary">Core Values</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {aboutData.values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: EASE,
                }}
                className="border border-amber-600 rounded-2xl p-6 hover:shadow-md transition"
              >
                <h4 className="text-xl font-semibold mb-2 text-color-primary">
                  {value.title}
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
