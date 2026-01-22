"use client";

import Image from "next/image";
import instagramIcon from "@/public/media/static/instagram.png";

interface InstagramFABProps {
  profileUrl: string; // full URL
}

export default function InstagramFAB({ profileUrl }: InstagramFABProps) {
  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="instagram-fab"
      aria-label="Visit Instagram"
    >
      <span className="pulse-ring"></span>

      <Image
        src={instagramIcon}
        alt="Instagram"
        width={26}
        height={26}
        priority
      />
    </a>
  );
}
