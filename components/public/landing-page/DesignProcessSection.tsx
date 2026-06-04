"use client";

import { motion } from "framer-motion";
import { designProcessData } from "@/lib/data/designProcess";

interface Props {
  theme?: "light" | "dark";
}

export default function DesignProcessSection({ theme = "light" }: Props) {
  const isDark = theme === "dark";

  return (
    <section className={`w-full py-24 overflow-hidden relative z-50 ${isDark ? 'bg-[#050505]' : 'bg-[#fafafa]'}`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our <span className="text-orange-500">Design</span> Process
          </h2>
          <p className={`mt-4 text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            A clear, connected, and transparent journey from idea to execution.
          </p>
        </motion.div>

        {/* DESKTOP PROCESS */}
        <div className="relative hidden lg:block">

          <div className={`absolute top-1/2 left-0 w-full h-[1px] ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {designProcessData.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === designProcessData.length - 1;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                >
                  {!isLast && (
                    <div className={`hidden lg:block absolute top-1/2 -right-5 w-10 h-[1px] ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
                  )}

                  <div className={`relative z-10 rounded-2xl p-6 border hover:shadow-lg transition ${isDark ? 'bg-zinc-900 border-white/5 hover:shadow-orange-500/10' : 'bg-white border-gray-200'}`}>
                    <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                      <Icon className="text-orange-500 text-2xl" />
                    </div>

                    <span className="text-sm font-semibold text-orange-500">
                      Step {step.id}
                    </span>

                    <h3 className={`mt-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>

                    <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* MOBILE PROCESS */}
        <div className="mt-20 lg:hidden block">
          <div className="relative space-y-10 pl-8">
            <div className={`absolute left-3 top-0 h-full w-[2px] ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

            {designProcessData.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex gap-6"
                >
                  <div className="relative z-10 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0">
                    <Icon className="text-lg" />
                  </div>

                  <div className={`rounded-xl p-5 border flex-1 ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-gray-200'}`}>
                    <span className="text-sm font-semibold text-orange-500">
                      Step {step.id}
                    </span>
                    <h3 className={`mt-1 text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                    <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
