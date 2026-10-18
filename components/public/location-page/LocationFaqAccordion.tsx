"use client";

/***************************************************
 * File: components/public/location-page/LocationFaqAccordion.tsx
 * Purpose: Accordion for area-specific FAQs (same look as the service
 * page accordion). All answers are in the HTML, so search engines read
 * them without JavaScript; the accordion only controls visibility.
 ***************************************************/

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function LocationFaqAccordion({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const [active, setActive] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = active === idx;
        return (
          <div
            key={`${faq.question}-${idx}`}
            className={`border transition-colors duration-300 rounded-2xl overflow-hidden bg-white ${
              isOpen ? "border-[#F97316] shadow-lg shadow-orange-500/5" : "border-gray-200"
            }`}
          >
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setActive(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`font-bold ${isOpen ? "text-[#F97316]" : "text-[#090F1A]"}`}>{faq.question}</span>
                <span
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isOpen ? "bg-[#F97316] text-white rotate-180" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <FiChevronDown aria-hidden="true" />
                </span>
              </button>
            </h3>
            <div className={isOpen ? "block" : "hidden"}>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">{faq.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
