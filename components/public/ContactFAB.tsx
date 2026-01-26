"use client";

import { useState } from "react";

import { FaHeadset, FaChevronUp } from "react-icons/fa";

import whatsapp from "@/public/assets/whatsapp.svg";
import phone from "@/public/assets/phone.png";
import instagram from "@/public/assets/instagram.png";
import { OptimizedImage } from "../common/OptimizedImage";

export default function ContactFAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-center gap-3">
      
      {/* Expanded contact options */}
      <div
        className={`flex flex-col items-center gap-3 transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* WhatsApp */}
        <a
          href="https://wa.me/918740990990"
          target="_blank"
          aria-label="Chat on WhatsApp"
          className="fab-item"
        >
          <OptimizedImage src={whatsapp} alt="WhatsApp" width={22} height={22} />
        </a>

        {/* Phone */}
        <a
          href="tel:+918740990990"
          aria-label="Call Now"
          className="fab-item"
        >
          <OptimizedImage src={phone} alt="Call" width={20} height={20} />
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/casa.chic_interior?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          aria-label="Instagram"
          className="fab-item"
        >
          <OptimizedImage src={instagram} alt="Instagram" width={20} height={20} />
        </a>
      </div>

      {/* Main FAB (Contact CTA) */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Contact Options"
        className="fab-main flex items-center gap-2 bg-bg-primary"
      >
        <FaHeadset size={20} />

        <FaChevronUp
          size={14}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
    </div>
  );
}
