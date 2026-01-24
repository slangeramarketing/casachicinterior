"use client";


import { OptimizedImage } from "@/components/common/OptimizedImage";
import { motion } from "framer-motion";

export default function ShortAboutSection() {
  return (
    <section className="w-full py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-snug">
            Designing Spaces
            <br />
            Where Luxury Meets{" "}
            <span className="text-orange-500">Comfort</span>
          </h2>

          <p className="mt-6 text-gray-600 text-sm md:text-base leading-relaxed max-w-lg">
            CasaChicInterior is a boutique-interior design studio dedicated
            to transforming your spaces into elegant, functional homes.
            With a passion for modern aesthetics and comfort, we craft
            living spaces that reflect your personality and lifestyle.
          </p>
        </motion.div>

        {/* RIGHT IMAGES */}
        <motion.div
          className="relative grid grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.3,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Large Image */}
          <div>
            <OptimizedImage
              src="/media/static/short-about-img1.png"
              alt="Luxury living room interior"
              width={400}
              height={400}
              className="rounded-xl object-cover w-full"
            />
          </div>

          {/* Small Image 1 */}
          <div className="flex items-end">
            <OptimizedImage
              src="/media/static/short-about-img2.png"
              alt="Modern sofa interior"
              width={300}
              height={220}
              className="rounded-xl object-cover w-full"
            />
          </div>

          {/* Small Image 2 */}
          <div className="col-span-2">
            <OptimizedImage
              src="/media/static/short-about-img3.png"
              alt="Minimal home interior"
              width={600}
              height={300}
              className="rounded-xl object-cover w-full"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
