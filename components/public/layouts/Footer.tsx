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
import { usePathname } from "next/navigation";
import { ServiceCategoryResponseDTO } from "@/modules/service-category/service-category.dto";

interface HeaderProps {
  mainServiceCategoryList: ServiceCategoryResponseDTO[];
  topServiceSubCatList: ServiceCategoryResponseDTO[];
}

export default function Footer({ mainServiceCategoryList, topServiceSubCatList }: HeaderProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/portfolio")) {
    return null;
  }

  return (
    <footer className="bg-linear-to-b from-[#0B1220] to-[#070C16] text-gray-300">
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
              <Link href="https://www.facebook.com/share/p/17wLP8x3zK/" aria-label="Facebook">
                <FiFacebook className="hover:text-orange-400 transition" />
              </Link>
              <Link href="https://www.instagram.com/casa.chic_interior?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram">
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
              {mainServiceCategoryList?.map((cat) => (
                <li key={cat.id}>
                  <Link key={cat.id} href={`/services/${cat.slug}`} >
                    {cat.name}
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
              {topServiceSubCatList?.map((subCat) => (
                <li key={subCat.id}>
                  <Link key={subCat.id} href={`/services/${subCat.slug}`} >
                    {subCat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <Link href={`tel:+918740990990`} aria-label="Call Casa Chic Interior" className="flex items-center gap-3">
                <li className="flex items-center gap-3">
                  <FiPhone className="text-orange-400" />
                  +91 87409 90990
                </li>
              </Link>
              <li className="flex items-center gap-3">
                <Link href={`mailto:contact@casachicinterior.com`} aria-label="Email Contact" className="flex items-center gap-3">
                  <FiMail className="text-orange-400" />
                  contact@casachicinterior.com
                </Link>

              </li>
              <li className="flex items-center gap-3">
                <Link href={`mailto:info@casachicinterior.com`} aria-label="Email Info" className="flex items-center gap-3">
                  <FiMail className="text-orange-400" />
                  info@casachicinterior.com
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <FiMapPin className="text-orange-400" />
                Delhi NCR, Noida Sector 62
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
            <Link href="/site-map" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
