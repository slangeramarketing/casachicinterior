"use client";

import Image from "next/image";
import phoneIcon from "@/public/media/static/phone.png";
import { OptimizedImage } from "../common/OptimizedImage";

interface PhoneFABProps {
  phoneNumber: string; // example: +919876543210
}

export default function PhoneFAB({ phoneNumber }: PhoneFABProps) {
  const phoneUrl = `tel:${phoneNumber}`;

  return (
    <a
      href={phoneUrl}
      className="phone-fab"
      aria-label="Call Now"
    >
      <span className="pulse-ring"></span>

      <OptimizedImage
        src={phoneIcon}
        alt="Call"
        width={26}
        height={26}
        priority
      />
    </a>
  );
}
