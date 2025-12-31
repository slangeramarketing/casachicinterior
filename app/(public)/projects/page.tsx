"use client";

import { useMemo, useState } from "react";
import SearchInput from "@/components/common/SearchInput";
import CategorySlider from "@/components/public/CategorySlider";
import { projects } from "@/lib/data/projects/projects";
import Image from "next/image";
import Link from "next/link";

export default function ProjectsPage() {
  const categories = [
    "All",
    "Featured",
    "Residential",
    "Office",
    "Commercial",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");


  /* ---------------- FILTER LOGIC ---------------- */
  const filteredProjects = useMemo(() => {
    let data = [...projects];

    /* -------- CATEGORY FILTER -------- */
    if (selectedCategory === "Featured") {
      data = data.filter((p) => p.featured);
    } else if (selectedCategory !== "All") {
      data = data.filter((p) =>
        p.category
          .toLowerCase()
          .includes(selectedCategory.toLowerCase())
      );
    }

    /* -------- SEARCH FILTER -------- */
    if (search.trim()) {
      const q = search.toLowerCase();

      data = data.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return data;
  }, [projects, selectedCategory, search]);



  return (
    <div className="w-full bg-white">
      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Our Completed Interior Projects
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-gray-600">
          Thoughtfully designed spaces delivered with precision, quality, and trust.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/contact"
            className="px-6 py-2 lg:py-3 border border-orange-500 rounded-md text-sm font-semibold text-black hover:text-white hover:bg-bg-primary"
          >
            Start Your Project
          </Link>
        </div>
      </section>

      <div className="flex lg:flex-row flex-col justify-between px-4 lg:px-32 gap-4">
        {/* ================= CATEGORY SLIDER ================= */}
        <section className="lg:w-[50%] px-6">
          <CategorySlider
            categories={categories}
            onChange={setSelectedCategory}
          />
        </section>

          {/* ================= SEARCH ================= */}
        <section className="lg:w-[40%] px-6 pb-4 flex justify-end">
          <SearchInput
            value={search}
            placeholder="Search projects..."
            onChange={setSearch}
            className="w-full"
          />

        </section>
      </div>

      {/* ================= PROJECT GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {filteredProjects.length === 0 ? (
          <p className="text-center text-gray-500">
            No projects found for this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition"
              >
                {/* IMAGE */}
                <div className="relative h-56 w-full">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />

                  {project.featured && (
                    <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {project.shortDescription}
                  </p>

                  {/* META */}
                  <div className="flex justify-between text-xs text-gray-500 pt-2">
                    <span>📍 {project.location}</span>
                    <span>⏱️ {project.duration}</span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-block mt-4 text-sm font-semibold text-orange-500 hover:underline"
                  >
                    View Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
