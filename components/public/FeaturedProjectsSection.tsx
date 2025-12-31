"use client";

import Image from "next/image";
import { featuredProjects } from "@/lib/data/featuredProjects";
import { useRouter } from "next/navigation";

/* -------------------------------------
   TYPES
------------------------------------- */
export interface FeaturedProject {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  slug:string;
}

interface Props {
  projects: FeaturedProject[];
}

export default function FeaturedProjectsSection({ projects }: Props) {
  const router=useRouter();
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Our Featured <span className="text-orange-500">Projects</span> & Quality
          </h2>
          <p className="mt-4 text-sm lg:text-base text-gray-600">
            These projects reflect creativity, precision, and attention to detail
            that define CasaChicInterior.
          </p>
        </div>

        {/* TIMELINE WRAPPER */}
        <div className="relative">

          {/* TIMELINE LINE */}
          <div className="absolute left-4 top-0 h-full w-[2px] bg-orange-200 lg:left-1/2" />

          <div className="space-y-20">
            {projects.map((project, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={project.id}
                  className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
                >
                  {/* IMAGE */}
                  <div
                    className={`relative flex pl-10 lg:pl-0 ${
                      isLeft ? "lg:justify-end lg:order-1" : "lg:justify-start lg:order-2"
                    }`}
                  >
                    <div className="relative w-full max-w-[500px] h-64 rounded-xl overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div
                    className={`relative pl-10 lg:pl-12 text-left ${
                      isLeft
                        ? "lg:order-2 lg:text-left"
                        : "lg:order-1 lg:text-right lg:pr-12"
                    }`}
                  >
                    <span
                      className={`absolute top-4 w-3 h-3 rounded-full bg-orange-500
                        left-[10px] right-auto lg:top-2
                        ${isLeft
                          ? "lg:left-auto lg:-left-[25px] lg:right-[609px]"
                          : "lg:right-auto lg:-right-[25px] lg:left-[610px]"}
                      `}
                    />


                    <h3 className="text-xl font-semibold text-gray-900">
                      {project.title}
                    </h3>

                    <h4 className="text-orange-500 font-semibold mt-1">
                      {project.subtitle}
                    </h4>

                    <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                      {project.description}
                    </p>

                    <div className={isLeft ? "" : "lg:flex lg:justify-end"}>
                      <button onClick={()=>router.push(`/projects/${project.slug}`)} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
                        See More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
