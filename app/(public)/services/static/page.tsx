"use client";

import LeadMagnetSection from "@/components/public/LeadMagnetSection";
import PortfolioShowcase from "@/components/public/PortfolioShowcase";
import PricingSection from "@/components/public/PricingSection";
import ProcessSection from "@/components/public/ProcessSection";
import React from "react";
import { FaCouch, FaHome, FaTools, FaBuilding } from "react-icons/fa";

const DetailServiceStatic: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Interior Design"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-3xl px-6 text-white">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Transform Your Space with Elegant Interior Design
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            From modular interiors to complete home renovations, we bring your
            vision to life with style and precision.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition">
              Book Free Consultation
            </button>
            <button className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg shadow-lg transition">
              View Our Work
            </button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            Trusted by Clients & Recognized by Industry
          </h2>
          <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
            Our work speaks for itself. Here’s what our clients say and the
            recognition we’ve earned.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "They transformed my living room beautifully. Highly professional and creative team!",
                name: "Priya Sharma",
                img: "https://source.unsplash.com/100x100/?woman,portrait",
              },
              {
                quote:
                  "Our office space looks modern and welcoming now. Great attention to detail.",
                name: "Rahul Mehta",
                img: "https://source.unsplash.com/100x100/?man,portrait",
              },
              {
                quote:
                  "From consultation to execution, everything was smooth. Highly recommend them!",
                name: "Sneha Kapoor",
                img: "https://source.unsplash.com/100x100/?face,portrait",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white shadow-md rounded-lg p-6 text-center"
              >
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <h4 className="mt-4 font-semibold text-gray-900">
                  {testimonial.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            Why Choose Our Services
          </h2>
          <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
            More than just interiors — we deliver lifestyle upgrades, comfort, and long-term value.
          </p>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Modular Interior",
                desc: "Saves space, modern look, easy maintenance.",
                icon: <FaCouch className="w-10 h-10 text-indigo-600" />,
              },
              {
                title: "Home Interior",
                desc: "Personalized designs that reflect your lifestyle.",
                icon: <FaHome className="w-10 h-10 text-indigo-600" />,
              },
              {
                title: "Home Renovation",
                desc: "Upgrade old spaces with fresh, functional designs.",
                icon: <FaTools className="w-10 h-10 text-indigo-600" />,
              },
              {
                title: "Commercial Space",
                desc: "Professional, welcoming environments for your business.",
                icon: <FaBuilding className="w-10 h-10 text-indigo-600" />,
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-gray-50 shadow-md rounded-lg p-6 text-center hover:shadow-lg transition"
              >
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h4 className="font-semibold text-gray-900 text-lg">
                  {benefit.title}
                </h4>
                <p className="mt-2 text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PortfolioShowcase/>
      <ProcessSection/>
      <PricingSection/>
      <LeadMagnetSection/>
    </>
  );
};

export default DetailServiceStatic;
