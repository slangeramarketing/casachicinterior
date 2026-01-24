"use client";

import Image from "next/image";
import whatsapp from "@/public/media/static/whatsapp.svg"
import { OptimizedImage } from "../common/OptimizedImage";

interface WhatsAppFABProps {
  phoneNumber: string; // with country code, example: 919876543210
  message?: string;
}

export default function WhatsAppFAB({
  phoneNumber,
  message = "Hello, I want to discuss a project",
}: WhatsAppFABProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Chat on WhatsApp"
    >
      <span className="pulse-ring"></span>

      <OptimizedImage
        src={whatsapp}
        alt="WhatsApp"
        width={28}
        height={28}
        priority
      />
    </a>
  );
}
