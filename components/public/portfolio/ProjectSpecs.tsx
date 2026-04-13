"use client";

import { motion } from "framer-motion";
import { FiDollarSign, FiPackage, FiClock } from "react-icons/fi";
import { PortfolioItemDTO } from "@/modules/portfolio/portfolio.dto";

interface ProjectSpecsProps {
  costRange: string;
  costBreakdown?: { category: string; amountLabel: string }[];
  materialSpecList: PortfolioItemDTO["materialSpecList"];
  milestones?: { title: string; day: string }[];
  timelineLabel: string;
}

export default function ProjectSpecs({
  costRange,
  costBreakdown,
  materialSpecList,
  milestones,
  timelineLabel,
}: ProjectSpecsProps) {
  return (
    <section className="py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Detailed Costing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-orange-50"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#F97316]">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[#090F1A] font-black text-xl">Project Costing</h3>
                <p className="text-[#F97316] font-bold text-sm">{costRange}</p>
              </div>
            </div>

            <div className="space-y-4">
              {costBreakdown ? (
                costBreakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <span className="text-gray-600 font-bold text-sm">{item.category}</span>
                    <span className="text-[#090F1A] font-black">{item.amountLabel}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">Standard category-wise breakup applied.</p>
              )}
            </div>
          </motion.div>

          {/* Premium Materials */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#090F1A] rounded-[2.5rem] p-8 shadow-xl text-white"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#1a2333] flex items-center justify-center text-[#F97316]">
                <FiPackage className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">The Brand List</h3>
                <p className="text-gray-400 font-bold text-sm">Certified Quality Partners</p>
              </div>
            </div>

            <div className="space-y-4">
              {materialSpecList.map((m, i) => (
                <div key={i} className="flex flex-col gap-1 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <span className="text-[#F97316] font-black text-sm uppercase">{m.brand}</span>
                  <span className="text-gray-400 text-xs font-medium">{m.category} — {m.productLine || "Ref Range"}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Project Timeline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#090F1A]">
                <FiClock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[#090F1A] font-black text-xl">Work Timeline</h3>
                <p className="text-blue-500 font-bold text-sm">Completed in {timelineLabel}</p>
              </div>
            </div>

            <div className="relative pl-8 border-l-2 border-dashed border-gray-100 space-y-8">
              {milestones ? (
                milestones.map((m, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white border-4 border-[#090F1A]" />
                    <h4 className="text-[#090F1A] font-black text-sm">{m.title}</h4>
                    <p className="text-gray-400 text-xs font-bold">{m.day}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                  <p className="text-gray-400 text-sm">Standard milestones followed as per BWP protocols.</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
