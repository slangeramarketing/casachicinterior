"use client";

import { ServiceResponseDTO } from "@/modules/services/service.dto";
import Image from "next/image";
import Link from "next/link";
import logoTransparent from "@/public/assets/logoTransparent.png";

import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiInstagram,
} from "react-icons/fi";

  interface HeaderProps {
    featuredServiceList:ServiceResponseDTO[];
  }

export default function Footer({featuredServiceList}:HeaderProps) {

  return (
    <footer className="bg-gradient-to-b from-[#0B1220] to-[#070C16] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              <Link href="/">
                <Image src={logoTransparent} height={80} width={80} alt="Casa-Chic-Interior-LOGO" />
              </Link>
            </h2>
            <p className="text-sm leading-relaxed">
              India’s most trusted home interior design service with
              50,000+ happy homes delivered.
            </p>

            <div className="flex gap-4 text-lg">
              <Link href="#" aria-label="Facebook">
                <FiFacebook className="hover:text-orange-400 transition" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <FiInstagram className="hover:text-orange-400 transition" />
              </Link>
            </div>
          </div>

          {/* DESIGN SOLUTIONS */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Design Solutions
            </h3>
            <ul className="space-y-3 text-sm">
              {featuredServiceList?.map((service) => (
                <li key={service.id}>
                <Link key={service.id} href={`/services/${service.slug}`} >
                {service.title}
              </Link>
              </li>
              ))}
            </ul>
          </div>

          {/* DESIGN IDEAS */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Design Ideas
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#">Living Room</Link></li>
              <li><Link href="#">Bedroom</Link></li>
              <li><Link href="#">Kitchen</Link></li>
              <li><Link href="#">Bathroom</Link></li>
              <li><Link href="#">Wardrobe</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <FiPhone className="text-orange-400" />
                +91 87409 90990
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-orange-400" />
                contact@casachicinterior.com
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-orange-400" />
                info@casachicinterior.com
              </li>
              <li className="flex items-center gap-3">
                <FiMapPin className="text-orange-400" />
                Noida
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">

          <p>
            © 2025 casachic Interior. All Rights Reserved.
          </p>

          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="terms-and-conditions" className="hover:text-white">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
