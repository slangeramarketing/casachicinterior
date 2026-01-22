"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

// Icons
import { FiHome, FiChevronDown } from "react-icons/fi";
import { FaBlog, FaUser } from "react-icons/fa";
import { LuBrainCircuit } from "react-icons/lu";
import { GoGear } from "react-icons/go";
import { MdOutlineReviews } from "react-icons/md";
import { CgPerformance } from "react-icons/cg";
import {
  IoChatboxEllipsesOutline,
  IoLogOutOutline,
} from "react-icons/io5";

/* -------------------------------------
   Types
------------------------------------- */
interface MenuItem {
  name: string;
  href?: string;
  icon: ReactNode;
  children?: { name: string; href: string }[];
}

/* -------------------------------------
   Component
------------------------------------- */
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [blogOpen, setBlogOpen] = useState<boolean>(
    pathname.startsWith("/admin/blogs")
  );

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/auth/login");
  };

  const menu: MenuItem[] = [
    { name: "Dashboard", href: "/admin/home", icon: <FiHome size={18} /> },

    // {
    //   name: "Blog",
    //   icon: <FaBlog size={18} />,
    //   children: [
    //     { name: "Blogs", href: "/admin/blogs" },
    //     { name: "Categories", href: "/admin/blogs/categories" },
    //   ],
    // },

    { name: "Blogs", href: "/admin/blogs", icon: <FaBlog size={18} /> },
    { name: "Service", href: "/admin/service", icon: <LuBrainCircuit size={18} /> },
    { name: "Projects", href: "/admin/projects", icon: <GoGear size={18} /> },
    { name: "User", href: "/admin/users", icon: <FaUser size={18} /> },
    { name: "Message", href: "/admin/message", icon: <IoChatboxEllipsesOutline size={18} /> },
    { name: "Review", href: "/admin/review", icon: <MdOutlineReviews size={18} /> },
    // { name: "Performance", href: "/admin/performance", icon: <CgPerformance size={18} /> },
  ];

  return (
    <aside className="h-full bg-white border-r border-gray-200 px-4 py-6">
      <nav className="flex flex-col gap-1">
        {menu.map((item) => {
          
          // 🔹 NORMAL MENU ITEM
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all
                ${
                  active
                    ? "bg-[#F97316]/10 text-[#F97316] font-semibold"
                    : "text-gray-700 hover:bg-[#F2F2F2]"
                }
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-md text-sm
          text-red-500 hover:bg-red-50 transition-all"
        >
          <IoLogOutOutline size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
