"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { ServiceResponseDTO } from "@/modules/services/service.dto";
import logoTransparent from "@/public/assets/logoTransparent.png";
import Image from "next/image";
import { ServiceCategoryResponseDTO } from "@/modules/service-category/service-category.dto";

interface HeaderProps {
  mainServiceCategoryList: ServiceCategoryResponseDTO[];
}

export default function Header({ mainServiceCategoryList }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  /* --------------------------------
     Hide / Show Header on Scroll
  --------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* --------------------------------
     Active underline styles
  --------------------------------- */
  const activeClass =
    "relative after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-white";

  const linkClass = (href: string) => {
    const isActive =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);

    return `font-medium transition ${isActive ? activeClass : "hover:opacity-80"
      }`;
  };

  if (pathname.startsWith("/portfolio")) {
    return null;
  }

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50
        transition-transform duration-300
        h-20
        ${showHeader ? "translate-y-0" : "-translate-y-full"}
        ${isHome ? "bg-bg-primary lg:bg-transparent" : "bg-bg-primary"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" aria-label="Casa Chic Interior Home" className="flex flex-col items-center text-lg font-bold text-white">
          {isHome ? (
            <>
              {/* Mobile view: show image + text below */}
              <div className="flex flex-col items-center sm:hidden">
                <span className="mt-2">CASA CHIC INTERIOR</span>
              </div>

              {/* Desktop view: show only image */}
              <div className="hidden sm:flex">
                <Image
                  src={logoTransparent}
                  height={80}
                  width={80}
                  alt="Casa-Chic-Interior-LOGO"
                  className="object-cover"
                />
              </div>
            </>
          ) : (
            <h2>CASA CHIC INTERIOR</h2>
          )}
        </Link>


        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-white">

          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          {/* DROPDOWN (HOVER SAFE) */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link href="/services" className="flex items-center gap-1 font-medium">
              Design Solutions <FiChevronDown />
            </Link>

            {/* IMPORTANT: Dropdown is NEVER unmounted */}
            <div
              className={`
                absolute top-full left-0 mt-2 w-56
                bg-white text-gray-800 rounded-md shadow-lg
                transition-all duration-200
                ${dropdownOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-1"
                }
              `}
            >
              {mainServiceCategoryList?.map((cat) => (
                <Link key={cat.id} href={`/services/${cat.slug}`} className="block px-4 py-2 hover:bg-gray-100">
                  {cat.name}
                </Link>
              ))}

            </div>
          </div>

          <Link href="/blogs" className={linkClass("/blogs")}>
            Blogs
          </Link>

          <Link href="/projects" className={linkClass("/projects")}>
            Projects
          </Link>

          <Link href="/services" className={linkClass("/services")}>
            Services
          </Link>

          <Link href="/about" className={linkClass("/about")}>
            About Us
          </Link>

          {/* CTA */}
          <Link
            href="/contact"
            className="
              border border-white px-5 py-2 rounded-full
              transition hover:bg-white hover:text-black
            "
          >
            Book Free Consultation
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close Menu" : "Open Menu"}
          className="md:hidden text-white text-2xl"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-bg-primary text-white px-6 py-6 space-y-4 flex flex-col">

          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <details>
            <summary className="flex justify-between items-center cursor-pointer">
              Design Solutions <FiChevronDown />
            </summary>

            <div className="ml-4 mt-2 space-y-2 text-sm">
              {mainServiceCategoryList?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setMenuOpen(false),
                      router.push(`/services/${cat.slug}`)
                  }}
                  className="block text-left w-full"
                >
                  {cat.name}
                </button>
              ))}

            </div>
          </details>

          <Link href="/blogs" onClick={() => setMenuOpen(false)}>
            Blogs
          </Link>

          <Link href="/projects" onClick={() => setMenuOpen(false)}>
            Projects
          </Link>

          <Link href="/services" onClick={() => setMenuOpen(false)}>
            Services
          </Link>

          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About Us
          </Link>

          <button
            onClick={() => {
              router.push('/contact'),
                setMenuOpen(false)
            }}
            className="w-full border border-white py-2 rounded-full mt-4"
          >
            Book Free Consultation
          </button>
        </div>
      )}

    </header>
  );
}
