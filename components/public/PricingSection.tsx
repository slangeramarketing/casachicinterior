"use client";

import React from "react";
import { FaCouch, FaHome, FaTools, FaBuilding } from "react-icons/fa";

const packages = [
  {
    title: "Modular Interior",
    desc: "Smart space-saving designs with modern aesthetics.",
    price: "Starting from ₹50,000",
    icon: <FaCouch className="w-10 h-10 text-indigo-600" />,
  },
  {
    title: "Home Interior",
    desc: "Personalized interiors tailored to your lifestyle.",
    price: "Starting from ₹1,20,000",
    icon: <FaHome className="w-10 h-10 text-indigo-600" />,
  },
  {
    title: "Home Renovation",
    desc: "Upgrade old spaces with fresh, functional designs.",
    price: "Packages from ₹2,00,000 - ₹5,00,000",
    icon: <FaTools className="w-10 h-10 text-indigo-600" />,
  },
  {
    title: "Commercial Space",
    desc: "Professional environments designed for productivity and style.",
    price: "Starting from ₹3,50,000",
    icon: <FaBuilding className="w-10 h-10 text-indigo-600" />,
  },
];

const PricingSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
          Pricing & Packages
        </h2>
        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
          Transparent pricing with flexible packages. Get a personalized quote tailored to your project.
        </p>

        {/* Packages Grid */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className="bg-gray-50 shadow-md rounded-lg p-6 text-center hover:shadow-xl transition duration-300 group"
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition">
                  {pkg.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {pkg.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{pkg.desc}</p>
              <p className="text-indigo-600 font-bold">{pkg.price}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition">
            Get Personalized Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
