"use client";

import { useState } from "react";
import faqData from "@/lib/data/faq.json";
import { FAQ } from "@/lib/data/faq";
import { FiPlus, FiMinus } from "react-icons/fi";

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("f1");

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full py-24 bg-bg-secondary">
      <div className="max-w-4xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-600">
            Clear answers to common questions about our interior design services.
          </p>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-4">
          {(faqData as FAQ[]).map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-gray-100 rounded-lg overflow-hidden"
              >
                {/* QUESTION */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-gray-900 text-sm md:text-base">
                    {faq.question}
                  </span>
                  <span className="text-xl text-gray-700">
                    {isOpen ? <FiMinus /> : <FiPlus />}
                  </span>
                </button>

                {/* ANSWER */}
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
