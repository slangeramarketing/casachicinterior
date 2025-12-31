"use client";
import { aboutData } from "@/lib/data/about";

export default function AboutPage() {
  return (
    <main className="bg-white text-black py-18">

      {/* HERO SECTION */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-3xl font-bold mb-4">
            About <span className="text-color-primary">{aboutData.brand}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-700 text-base md:text-md">
            {aboutData.tagline}
          </p>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">
              Who We Are
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {aboutData.description}
            </p>
          </div>

          <div className="bg-bg-secondary p-8 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-3 text-color-primary">
              Design Philosophy
            </h3>
            <p className="text-gray-700">
              We believe interiors should not only look beautiful but also
              enhance the way people live, work, and feel inside a space.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-bg-secondary py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-xl shadow-sm border-amber-600 border">
            <h3 className="text-2xl font-semibold mb-3 text-color-primary">
              {aboutData.mission.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {aboutData.mission.content}
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border-amber-600 border">
            <h3 className="text-2xl font-semibold mb-3 text-color-primary">
              {aboutData.vision.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {aboutData.vision.content}
            </p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">
              Our <span className="text-color-primary">Core Values</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {aboutData.values.map((value, index) => (
              <div
                key={index}
                className="border-amber-600 border rounded-xl p-6 hover:shadow-md transition"
              >
                <h4 className="text-xl font-semibold mb-2 text-color-primary">
                  {value.title}
                </h4>
                <p className="text-gray-700 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
