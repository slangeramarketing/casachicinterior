"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "919999999999"; // Replace with actual number
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello CasaChic! I'd like a free quote for my home renovation project."
);

export default function WhatsAppCTA() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#F97316] text-white px-5 py-4 rounded-full shadow-2xl font-semibold text-sm group overflow-hidden"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 bg-[#F97316] rounded-full animate-ping opacity-30 group-hover:opacity-0" />
      <FaWhatsapp className="w-6 h-6 relative z-10" />
      <span className="relative z-10 hidden sm:block">Get Free Quote</span>
    </motion.a>
  );
}
