"use client";

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
import { ServiceCategoryResponseDTO } from "@/modules/service-category/service-category.dto";
import { LocationLinkDTO } from "@/modules/locations/location.dto";

/** Slim link data for a published service (Dashboard > Service). */
export interface FooterServiceLink {
  id: string;
  title: string;
  slug: string;
}

interface HeaderProps {
  mainServiceCategoryList: ServiceCategoryResponseDTO[];
  topServiceSubCatList: ServiceCategoryResponseDTO[];
  /** Published services; the pages that should rank, so every page links to them. */
  services?: FooterServiceLink[];
  /** Published area landing pages (Dashboard > Locations). */
  locations?: LocationLinkDTO[];
}

const COMPANY_LINKS = [
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/contact" },
  { name: "Book Free Consultation", href: "/contact" },
];

const linkClass = "hover:text-white transition-colors";

export default function Footer({
  mainServiceCategoryList,
  topServiceSubCatList,
  services = [],
  locations = [],
}: HeaderProps) {
  const year = new Date().getFullYear();
  const hasDesignIdeas = (topServiceSubCatList?.length ?? 0) > 0;

  return (
    <footer className="bg-linear-to-b from-[#0B1220] to-[#070C16] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP GRID: brand, solutions, services, (design ideas), company, contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">

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
                  <Link href={`/services/${cat.slug}`} className={linkClass}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* OUR SERVICES: direct links to the service detail pages */}
          {services.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-4">
                Our Services
              </h3>
              <ul className="space-y-3 text-sm">
                {services.slice(0, 8).map((service) => (
                  <li key={service.id}>
                    <Link href={`/services/detail/${service.slug}`} className={linkClass}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* DESIGN IDEAS: sub-categories, only when any exist */}
          {hasDesignIdeas && (
            <div>
              <h3 className="text-white font-semibold mb-4">
                Design Ideas
              </h3>
              <ul className="space-y-3 text-sm">
                {topServiceSubCatList.map((subCat) => (
                  <li key={subCat.id}>
                    <Link href={`/services/${subCat.slug}`} className={linkClass}>
                      {subCat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* COMPANY */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              {COMPANY_LINKS.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={linkClass}>
                    {item.name}
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
              {/* <li> must be the direct child of <ul>; the link goes inside it */}
              <li className="flex items-center gap-3">
                <Link href={`tel:+918740990990`} className="flex items-center gap-3">
                  <FiPhone className="text-orange-400" />
                  +91 87409 90990
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Link href={`mailto:contact@casachicinterior.com`} className="flex items-center gap-3">
                  <FiMail className="text-orange-400" />
                  contact@casachicinterior.com
                </Link>

              </li>
              <li className="flex items-center gap-3">
                <Link href={`mailto:info@casachicinterior.com`} className="flex items-center gap-3">
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

        {/* AREAS WE SERVE: internal links to the area landing pages */}
        {locations.length > 0 && (
          <div className="border-t border-white/10 mt-12 pt-6 text-sm">
            <h3 className="text-white font-semibold mb-3">Areas We Serve</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link href={`/${loc.slug}`} className={linkClass}>
                    {loc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* DIVIDER */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">

          <p>
            © {year} Casa Chic Interior. All Rights Reserved.
          </p>

          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white">Terms &amp; Conditions</Link>
            <Link href="/site-map" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
