"use client";

import { designProcessData } from "@/lib/data/designProcess";

export default function DesignProcessSection() {
  return (
    <section className="w-full py-24 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our <span className="text-orange-500">Design</span> Process
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-600">
            A clear, connected, and transparent journey from idea to execution.
          </p>
        </div>

        {/* PROCESS */}
        <div className="relative hidden lg:block">

          {/* DESKTOP CONNECTOR LINE */}
          <div className="lg:block hidden absolute top-1/2 left-0 w-full h-[1px] bg-gray-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {designProcessData.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === designProcessData.length - 1;

              return (
                <div key={step.id} className="relative">

                  {/* CONNECTOR (DESKTOP) */}
                  {!isLast && (
                    <div className="hidden lg:block absolute top-1/2 -right-5 w-10 h-[1px] bg-gray-300" />
                  )}

                  {/* CARD */}
                  <div className="relative z-10 bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">

                    {/* ICON */}
                    <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                      <Icon className="text-orange-500 text-2xl" />
                    </div>

                    {/* STEP */}
                    <span className="text-sm font-semibold text-orange-500">
                      Step {step.id}
                    </span>

                    {/* TITLE */}
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE CONNECTED VIEW */}
        <div className="mt-20 lg:hidden block">
          <div className="relative space-y-10 pl-8">

            {/* VERTICAL LINE */}
            <div className="absolute left-3 top-0 h-full w-[2px] bg-gray-200" />

            {designProcessData.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative flex gap-6">
                  {/* DOT */}
                  <div className="relative z-10 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                    <Icon className="text-lg" />
                  </div>

                  {/* CONTENT */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 flex-1">
                    <span className="text-sm font-semibold text-orange-500">
                      Step {step.id}
                    </span>
                    <h3 className="mt-1 text-base font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
