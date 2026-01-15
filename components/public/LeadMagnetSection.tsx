"use client";

import React, { useState } from "react";
import { FaGift } from "react-icons/fa";

const LeadMagnetSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just log data (later connect with backend/db)
    console.log("Lead Magnet Form Submitted:", formData);
    alert("Thank you! We'll send your free guide soon.");
    setFormData({ name: "", email: "", phone: "" });
  };

  return (
    <section className="py-16 bg-indigo-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Heading */}
        <div className="flex justify-center mb-6">
          <FaGift className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Get Your Free Interior Design Guide
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Download our exclusive Interior Design Guide or book a free Moodboard Consultation.
          Share your details below and start your transformation journey.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white shadow-md rounded-lg p-6 max-w-md mx-auto"
        >
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
          >
            Download Free Guide
          </button>
        </form>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
