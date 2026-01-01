"use client";
import { servicesData } from "@/lib/data/services/service.data";

import Link from "next/link";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiYoutube,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0B1220] to-[#070C16] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              CASA CHIC INTERIOR
            </h2>
            <p className="text-sm leading-relaxed">
              India’s most trusted home interior design service with
              50,000+ happy homes delivered.
            </p>

            <div className="flex gap-4 text-lg">
              <Link href="https://www.facebook.com/people/Casa-Chic-Interiors/61578323402585/" aria-label="Facebook">
                <FiFacebook className="hover:text-orange-400 transition" />
              </Link>
              <Link href="https://www.instagram.com/casa.chic_interior?utm_source=qr&igsh=ZDRkbW1pemRmaTRn" aria-label="Instagram">
                <FiInstagram className="hover:text-orange-400 transition" />
              </Link>
              <Link href="https://www.youtube.com/@CasaChicInteriors" aria-label="Youtube">
                <FiYoutube className="hover:text-orange-400 transition" />
              </Link>
            </div>
          </div>

          {/* DESIGN SOLUTIONS */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Design Solutions
            </h3>
            <ul className="space-y-3 text-sm">
              {servicesData.map((service) => (
                <li>
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="hover:text-orange-500"
                >
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
            <ul className="flex flex-col gap-2 text-sm">
             <Link href="tel:+918740990990">
                <li className="flex items-center gap-3">
                <FiPhone className="text-orange-400" />
                +91 87409-90990
              </li>
             </Link>
              <Link href="mailto:casa.chic.interior@gmail.com">
                <li className="flex items-center gap-3">
                <FiMail className="text-orange-400" />
                casa.chic.interior@gmail.com
              </li>
              </Link>
             <Link href="https://www.google.com/maps/place/Police+Station+ECOTECH+3rd/@28.5465806,77.4551376,511m/data=!3m1!1e3!4m12!1m5!3m4!2zMjjCsDMyJzQ4LjEiTiA3N8KwMjcnMjIuMCJF!8m2!3d28.5466843!4d77.4561005!3m5!1s0x390ce96e41751601:0xe7fe081bb35a8c49!8m2!3d28.5463136!4d77.456855!16s%2Fg%2F11f9xlw8vx?hl=en&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D">
                <li className="flex items-center gap-3">
                <FiMapPin className="text-orange-400" />
                Noida
              </li>
             </Link>
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
